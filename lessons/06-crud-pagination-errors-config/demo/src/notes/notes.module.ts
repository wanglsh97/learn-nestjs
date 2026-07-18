import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { ClockModule } from '../core/clock.module';
import { Note } from './note';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [ClockModule, TypeOrmModule.forFeature([Note])],
  controllers: [NotesController],
  providers: [ApiKeyGuard, NotesService],
})
export class NotesModule {}
