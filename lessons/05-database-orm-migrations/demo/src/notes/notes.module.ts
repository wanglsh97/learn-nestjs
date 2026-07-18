import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClockModule } from '../core/clock.module';
import { Note } from './note';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [ClockModule, TypeOrmModule.forFeature([Note])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
