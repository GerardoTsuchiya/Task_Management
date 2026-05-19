import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });
  }

  async create(userId: number, createProjectDto: CreateProjectDto) {
    try {
      return await this.prisma.project.create({
        data: {
          ...createProjectDto,
          userId,
        },
        include: {
          _count: {
            select: { tasks: true },
          },
        },
      });
    } catch (error) {
      this.handleProjectNameConflict(error);
      throw error;
    }
  }

  async findOne(userId: number, id: number) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(userId: number, id: number, updateProjectDto: UpdateProjectDto) {
    await this.ensureProjectBelongsToUser(userId, id);

    try {
      return await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
        include: {
          _count: {
            select: { tasks: true },
          },
        },
      });
    } catch (error) {
      this.handleProjectNameConflict(error);
      throw error;
    }
  }

  async remove(userId: number, id: number) {
    await this.ensureProjectBelongsToUser(userId, id);

    return this.prisma.project.delete({
      where: { id },
    });
  }

  private async ensureProjectBelongsToUser(userId: number, id: number) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
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
