import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByTask(userId: number, taskId: number) {
    await this.ensureTaskBelongsToUser(userId, taskId);

    return this.prisma.subtask.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(
    userId: number,
    taskId: number,
    createSubtaskDto: CreateSubtaskDto,
  ) {
    await this.ensureTaskBelongsToUser(userId, taskId);

    return this.prisma.subtask.create({
      data: {
        title: createSubtaskDto.title,
        taskId,
      },
    });
  }

  findOne(userId: number, id: number) {
    return this.ensureSubtaskBelongsToUser(userId, id);
  }

  async update(
    userId: number,
    id: number,
    updateSubtaskDto: UpdateSubtaskDto,
  ) {
    await this.ensureSubtaskBelongsToUser(userId, id);

    return this.prisma.subtask.update({
      where: { id },
      data: updateSubtaskDto,
    });
  }

  async complete(userId: number, id: number) {
    await this.ensureSubtaskBelongsToUser(userId, id);

    return this.prisma.subtask.update({
      where: { id },
      data: { completed: true },
    });
  }

  async uncomplete(userId: number, id: number) {
    await this.ensureSubtaskBelongsToUser(userId, id);

    return this.prisma.subtask.update({
      where: { id },
      data: { completed: false },
    });
  }

  async remove(userId: number, id: number) {
    await this.ensureSubtaskBelongsToUser(userId, id);

    return this.prisma.subtask.delete({
      where: { id },
    });
  }

  private async ensureTaskBelongsToUser(userId: number, taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
      select: { id: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
  }

  private async ensureSubtaskBelongsToUser(userId: number, id: number) {
    const subtask = await this.prisma.subtask.findFirst({
      where: {
        id,
        task: {
          userId,
        },
      },
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    return subtask;
  }
}
