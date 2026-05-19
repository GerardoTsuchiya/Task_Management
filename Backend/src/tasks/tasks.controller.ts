import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('views/inbox')
  findInbox(@GetUser() user: AuthenticatedUser) {
    return this.tasksService.findInbox(user.id);
  }

  @Get('views/today')
  findToday(@GetUser() user: AuthenticatedUser) {
    return this.tasksService.findToday(user.id);
  }

  @Get('views/upcoming')
  findUpcoming(@GetUser() user: AuthenticatedUser) {
    return this.tasksService.findUpcoming(user.id);
  }

  @Get('views/overdue')
  findOverdue(@GetUser() user: AuthenticatedUser) {
    return this.tasksService.findOverdue(user.id);
  }

  @Get()
  findAll(
    @GetUser() user: AuthenticatedUser,
    @Query() query: TaskQueryDto,
  ) {
    return this.tasksService.findAll(user.id, query);
  }

  @Post()
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(user.id, createTaskDto);
  }

  @Get(':id')
  findOne(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.findOne(user.id, id);
  }

  @Patch(':id/complete')
  complete(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.complete(user.id, id);
  }

  @Patch(':id/uncomplete')
  uncomplete(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.uncomplete(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, id, updateTaskDto);
  }

  @Delete(':id')
  remove(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.remove(user.id, id);
  }
}
