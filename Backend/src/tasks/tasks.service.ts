import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number, query: TaskQueryDto) {
    return this.prisma.task.findMany({
      where: this.buildTaskFilters(userId, query),
      orderBy: { createdAt: 'desc' },
      include: this.getTaskInclude(),
    });
  }

  async create(userId: number, createTaskDto: CreateTaskDto) {
    if (createTaskDto.projectId) {
      await this.ensureProjectAccessibleByUser(userId, createTaskDto.projectId);

      if (createTaskDto.assignedToId) {
        await this.ensureUserIsMemberOfProject(
          createTaskDto.assignedToId,
          createTaskDto.projectId,
        );
      }
    }

    const completionData = this.buildCompletionData({ status: createTaskDto.status });

    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
        priority: createTaskDto.priority,
        status: completionData.status ?? createTaskDto.status,
        completed: completionData.completed,
        completedAt: completionData.completedAt,
        userId,
        projectId: createTaskDto.projectId ?? null,
        assignedToId: createTaskDto.assignedToId ?? null,
      },
      include: this.getTaskInclude(),
    });
  }

  async findOne(userId: number, id: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        OR: [{ userId }, { assignedToId: userId }],
      },
      include: this.getTaskInclude(),
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(userId: number, id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.ensureTaskBelongsToUser(userId, id);

    const projectId = updateTaskDto.projectId !== undefined
      ? updateTaskDto.projectId
      : task.projectId;

    if (updateTaskDto.projectId !== undefined && updateTaskDto.projectId !== null) {
      await this.ensureProjectAccessibleByUser(userId, updateTaskDto.projectId);
    }

    if (updateTaskDto.assignedToId && projectId) {
      await this.ensureUserIsMemberOfProject(updateTaskDto.assignedToId, projectId);
    }

    const completionData = this.buildCompletionData({
      completed: updateTaskDto.completed,
      status: updateTaskDto.status,
    });

    return this.prisma.task.update({
      where: { id },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        dueDate:
          updateTaskDto.dueDate === undefined
            ? undefined
            : updateTaskDto.dueDate === null
              ? null
              : new Date(updateTaskDto.dueDate),
        priority: updateTaskDto.priority,
        status: completionData.status ?? updateTaskDto.status,
        completed: completionData.completed,
        completedAt: completionData.completedAt,
        projectId:
          updateTaskDto.projectId === undefined ? undefined : updateTaskDto.projectId,
        assignedToId:
          updateTaskDto.assignedToId === undefined ? undefined : updateTaskDto.assignedToId,
      },
      include: this.getTaskInclude(),
    });
  }

  async remove(userId: number, id: number) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.task.delete({ where: { id } });
  }

  async complete(userId: number, id: number) {
    await this.ensureTaskBelongsToUser(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: { completed: true, status: TaskStatus.COMPLETED, completedAt: new Date() },
      include: this.getTaskInclude(),
    });
  }

  async uncomplete(userId: number, id: number) {
    await this.ensureTaskBelongsToUser(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: { completed: false, status: TaskStatus.PENDING, completedAt: null },
      include: this.getTaskInclude(),
    });
  }

  findInbox(userId: number) {
    return this.prisma.task.findMany({
      where: {
        OR: [{ userId }, { assignedToId: userId }],
        projectId: null,
        completed: false,
      },
      orderBy: { createdAt: 'desc' },
      include: this.getTaskInclude(),
    });
  }

  findToday(userId: number) {
    const { startOfToday, startOfTomorrow } = this.getTodayRange();

    return this.prisma.task.findMany({
      where: {
        OR: [{ userId }, { assignedToId: userId }],
        completed: false,
        dueDate: { gte: startOfToday, lt: startOfTomorrow },
      },
      orderBy: { createdAt: 'desc' },
      include: this.getTaskInclude(),
    });
  }

  findUpcoming(userId: number) {
    const { startOfTomorrow } = this.getTodayRange();

    return this.prisma.task.findMany({
      where: {
        OR: [{ userId }, { assignedToId: userId }],
        completed: false,
        dueDate: { gte: startOfTomorrow },
      },
      orderBy: { createdAt: 'desc' },
      include: this.getTaskInclude(),
    });
  }

  findOverdue(userId: number) {
    const { startOfToday } = this.getTodayRange();

    return this.prisma.task.findMany({
      where: {
        OR: [{ userId }, { assignedToId: userId }],
        completed: false,
        dueDate: { lt: startOfToday },
      },
      orderBy: { createdAt: 'desc' },
      include: this.getTaskInclude(),
    });
  }

  private async ensureTaskBelongsToUser(userId: number, id: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        OR: [{ userId }, { assignedToId: userId }],
      },
      select: { id: true, projectId: true },
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  private async ensureProjectAccessibleByUser(userId: number, projectId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [{ userId }, { members: { some: { userId, status: 'accepted' } } }],
      },
      select: { id: true },
    });

    if (!project) throw new NotFoundException('Project not found');
  }

  private async ensureUserIsMemberOfProject(userId: number, projectId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [{ userId }, { members: { some: { userId, status: 'accepted' } } }],
      },
      select: { id: true },
    });

    if (!project) {
      throw new BadRequestException('Assigned user is not a member of this project');
    }
  }

  private buildTaskFilters(
    userId: number,
    query: TaskQueryDto,
  ): Prisma.TaskWhereInput {
    const where: Prisma.TaskWhereInput = {
      OR: [{ userId }, { assignedToId: userId }],
    };

    if (query.search) {
      where.AND = [
        {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    if (query.projectId !== undefined) {
      where.projectId = query.projectId;
    }

    if (query.labelId !== undefined) {
      where.taskLabels = { some: { labelId: query.labelId } };
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.completed !== undefined) {
      where.completed = query.completed;
    }

    return where;
  }

  private buildCompletionData(input: {
    completed?: boolean;
    status?: TaskStatus;
  }): { completed?: boolean; status?: TaskStatus; completedAt?: Date | null } {
    if (input.completed === true) {
      return { completed: true, status: TaskStatus.COMPLETED, completedAt: new Date() };
    }

    if (input.completed === false) {
      return {
        completed: false,
        status: input.status ?? TaskStatus.PENDING,
        completedAt: null,
      };
    }

    if (input.status === TaskStatus.COMPLETED) {
      return { completed: true, status: TaskStatus.COMPLETED, completedAt: new Date() };
    }

    if (
      input.status === TaskStatus.PENDING ||
      input.status === TaskStatus.IN_PROGRESS
    ) {
      return { completed: false, status: input.status, completedAt: null };
    }

    return {};
  }

  private getTodayRange() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    return { startOfToday, startOfTomorrow };
  }

  private getTaskInclude() {
    return {
      project: true,
      assignedTo: { select: { id: true, name: true, email: true } },
      subtasks: { orderBy: { createdAt: 'desc' as const } },
      taskLabels: { include: { label: true } },
    };
  }
}
