import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SubtasksController } from './subtasks.controller';
import { SubtasksService } from './subtasks.service';

@Module({
  imports: [PrismaModule],
  controllers: [SubtasksController],
  providers: [SubtasksService],
})
export class SubtasksModule {}
