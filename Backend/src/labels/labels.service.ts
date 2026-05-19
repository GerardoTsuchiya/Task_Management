import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.label.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: number, createLabelDto: CreateLabelDto) {
    try {
      return await this.prisma.label.create({
        data: {
          ...createLabelDto,
          userId,
        },
      });
    } catch (error) {
      this.handleLabelNameConflict(error);
      throw error;
    }
  }

  async findOne(userId: number, id: number) {
    const label = await this.prisma.label.findFirst({
      where: { id, userId },
      include: {
        taskLabels: {
          include: {
            task: true,
          },
        },
      },
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    return label;
  }

  async update(userId: number, id: number, updateLabelDto: UpdateLabelDto) {
    await this.ensureLabelBelongsToUser(userId, id);

    try {
      return await this.prisma.label.update({
        where: { id },
        data: updateLabelDto,
      });
    } catch (error) {
      this.handleLabelNameConflict(error);
      throw error;
    }
  }

  async remove(userId: number, id: number) {
    await this.ensureLabelBelongsToUser(userId, id);

    return this.prisma.label.delete({
      where: { id },
    });
  }

  async assignTask(userId: number, labelId: number, taskId: number) {
    await this.ensureLabelBelongsToUser(userId, labelId);
    await this.ensureTaskBelongsToUser(userId, taskId);

    try {
      return await this.prisma.taskLabel.create({
        data: {
          labelId,
          taskId,
        },
        include: {
          label: true,
          task: true,
        },
      });
    } catch (error) {
      this.handleTaskLabelConflict(error);
      throw error;
    }
  }

  async removeTask(userId: number, labelId: number, taskId: number) {
    await this.ensureLabelBelongsToUser(userId, labelId);
    await this.ensureTaskBelongsToUser(userId, taskId);

    const taskLabel = await this.prisma.taskLabel.findUnique({
      where: {
        taskId_labelId: {
          taskId,
          labelId,
        },
      },
      select: { id: true },
    });

    if (!taskLabel) {
      throw new NotFoundException('Task label relation not found');
    }

    return this.prisma.taskLabel.delete({
      where: { id: taskLabel.id },
    });
  }

  private async ensureLabelBelongsToUser(userId: number, id: number) {
    const label = await this.prisma.label.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }
  }

  private async ensureTaskBelongsToUser(userId: number, id: number) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
  }

  private handleLabelNameConflict(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Label name already exists');
    }
  }

  private handleTaskLabelConflict(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Label is already assigned to this task');
    }
  }
}
