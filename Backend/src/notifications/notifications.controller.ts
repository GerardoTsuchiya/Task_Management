import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@GetUser() user: AuthenticatedUser) {
    return this.notificationsService.findAll(user.id);
  }

  @Patch('read-all')
  markAllRead(@GetUser() user: AuthenticatedUser) {
    return this.notificationsService.markAllRead(user.id);
  }

  @Patch(':id/read')
  markRead(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationsService.markRead(user.id, id);
  }

  @Get('invitations')
  getPendingInvitations(@GetUser() user: AuthenticatedUser) {
    return this.notificationsService.findPendingInvitations(user.id);
  }

  @Patch('invitations/:id/accept')
  acceptInvitation(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationsService.acceptInvitation(user.id, id);
  }

  @Delete('invitations/:id/decline')
  declineInvitation(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationsService.declineInvitation(user.id, id);
  }
}
