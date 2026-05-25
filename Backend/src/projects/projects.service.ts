import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

const memberInclude = {
  include: {
    user: { select: { id: true, name: true, email: true } },
  },
};

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { userId },
          { members: { some: { userId, status: 'accepted' } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { tasks: true } },
        members: memberInclude,
      },
    });
  }

  async create(userId: number, createProjectDto: CreateProjectDto) {
    try {
      return await this.prisma.project.create({
        data: { ...createProjectDto, userId },
        include: {
          _count: { select: { tasks: true } },
          members: memberInclude,
        },
      });
    } catch (error) {
      this.handleProjectNameConflict(error);
      throw error;
    }
  }

  async findOne(userId: number, id: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { members: { some: { userId, status: 'accepted' } } },
        ],
      },
      include: {
        tasks: { orderBy: { createdAt: 'desc' } },
        members: memberInclude,
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(userId: number, id: number, updateProjectDto: UpdateProjectDto) {
    await this.ensureProjectBelongsToUser(userId, id);

    try {
      return await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
        include: {
          _count: { select: { tasks: true } },
          members: memberInclude,
        },
      });
    } catch (error) {
      this.handleProjectNameConflict(error);
      throw error;
    }
  }

  async remove(userId: number, id: number) {
    await this.ensureProjectBelongsToUser(userId, id);
    return this.prisma.project.delete({ where: { id } });
  }

  async inviteMember(ownerId: number, projectId: number, dto: InviteMemberDto) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId: ownerId },
      select: { id: true, name: true },
    });

    if (!project) throw new NotFoundException('Project not found');

    const invitedUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, name: true, email: true },
    });

    if (!invitedUser) throw new NotFoundException('User not found');
    if (invitedUser.id === ownerId) {
      throw new BadRequestException('Cannot invite yourself to your own project');
    }

    const owner = await this.prisma.user.findUnique({
      where: { id: ownerId },
      select: { name: true },
    });

    try {
      const member = await this.prisma.projectMember.create({
        data: { projectId, userId: invitedUser.id, status: 'pending' },
        ...memberInclude,
      });

      await this.prisma.notification.create({
        data: {
          userId: invitedUser.id,
          type: 'project_invitation',
          title: 'Nueva invitación a proyecto',
          body: `${owner!.name} te invitó a unirte al proyecto "${project.name}"`,
          data: { projectId, projectName: project.name, memberId: member.id },
        },
      });

      return member;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User already has a pending or accepted invitation');
      }
      throw error;
    }
  }

  async removeMember(ownerId: number, projectId: number, memberId: number) {
    await this.ensureProjectBelongsToUser(ownerId, projectId);

    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: memberId } },
    });

    if (!member) throw new NotFoundException('Member not found');

    return this.prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId: memberId } },
    });
  }

  async getMembers(userId: number, projectId: number) {
    await this.ensureProjectAccessibleByUser(userId, projectId);

    return this.prisma.projectMember.findMany({
      where: { projectId, status: 'accepted' },
      ...memberInclude,
    });
  }

  async ensureProjectAccessibleByUser(userId: number, projectId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId },
          { members: { some: { userId, status: 'accepted' } } },
        ],
      },
      select: { id: true },
    });

    if (!project) throw new NotFoundException('Project not found');
  }

  private async ensureProjectBelongsToUser(userId: number, id: number) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!project) throw new NotFoundException('Project not found');
  }

  private handleProjectNameConflict(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Project name already exists');
    }
  }
}
