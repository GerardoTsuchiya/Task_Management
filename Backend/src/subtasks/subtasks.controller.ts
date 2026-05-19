import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { SubtasksService } from './subtasks.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Get('tasks/:taskId/subtasks')
  findAllByTask(
    @GetUser() user: AuthenticatedUser,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.subtasksService.findAllByTask(user.id, taskId);
  }

  @Post('tasks/:taskId/subtasks')
  create(
    @GetUser() user: AuthenticatedUser,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() createSubtaskDto: CreateSubtaskDto,
  ) {
    return this.subtasksService.create(user.id, taskId, createSubtaskDto);
  }

  @Patch('subtasks/:id/complete')
  complete(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.subtasksService.complete(user.id, id);
  }

  @Patch('subtasks/:id/uncomplete')
  uncomplete(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.subtasksService.uncomplete(user.id, id);
  }

  @Patch('subtasks/:id')
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.subtasksService.update(user.id, id, updateSubtaskDto);
  }

  @Get('subtasks/:id')
  findOne(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.subtasksService.findOne(user.id, id);
  }

  @Delete('subtasks/:id')
  remove(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.subtasksService.remove(user.id, id);
  }
}
