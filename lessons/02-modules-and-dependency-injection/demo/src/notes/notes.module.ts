import { Module } from '@nestjs/common';
import { ClockModule } from '../core/clock.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [ClockModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
