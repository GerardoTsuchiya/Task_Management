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
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { LabelsService } from './labels.service';

@Controller('labels')
@UseGuards(JwtAuthGuard)
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get()
  findAll(@GetUser() user: AuthenticatedUser) {
    return this.labelsService.findAll(user.id);
  }

  @Post()
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createLabelDto: CreateLabelDto,
  ) {
    return this.labelsService.create(user.id, createLabelDto);
  }

  @Post(':labelId/tasks/:taskId')
  assignTask(
    @GetUser() user: AuthenticatedUser,
    @Param('labelId', ParseIntPipe) labelId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.labelsService.assignTask(user.id, labelId, taskId);
  }

  @Delete(':labelId/tasks/:taskId')
  removeTask(
    @GetUser() user: AuthenticatedUser,
    @Param('labelId', ParseIntPipe) labelId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.labelsService.removeTask(user.id, labelId, taskId);
  }

  @Get(':id')
  findOne(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.labelsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLabelDto: UpdateLabelDto,
  ) {
    return this.labelsService.update(user.id, id, updateLabelDto);
  }

  @Delete(':id')
  remove(
    @GetUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.labelsService.remove(user.id, id);
  }
}
