import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(userId: number, id: number) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return { message: 'All notifications marked as read' };
  }

  findPendingInvitations(userId: number) {
    return this.prisma.projectMember.findMany({
      where: { userId, status: 'pending' },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptInvitation(userId: number, memberId: number) {
    const member = await this.prisma.projectMember.findFirst({
      where: { id: memberId, userId, status: 'pending' },
      include: { project: { select: { name: true } } },
    });

    if (!member) throw new NotFoundException('Invitation not found');

    const updated = await this.prisma.projectMember.update({
      where: { id: memberId },
      data: { status: 'accepted' },
      include: {
        project: { select: { id: true, name: true, color: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await this.prisma.notification.updateMany({
      where: {
        userId,
        type: 'project_invitation',
        data: { path: ['memberId'], equals: memberId },
      },
      data: { read: true },
    });

    return updated;
  }

  async declineInvitation(userId: number, memberId: number) {
    const member = await this.prisma.projectMember.findFirst({
      where: { id: memberId, userId, status: 'pending' },
    });

    if (!member) throw new NotFoundException('Invitation not found');

    await this.prisma.projectMember.delete({ where: { id: memberId } });

    await this.prisma.notification.updateMany({
      where: {
        userId,
        type: 'project_invitation',
        data: { path: ['memberId'], equals: memberId },
      },
      data: { read: true },
    });

    return { message: 'Invitation declined' };
  }
}
