import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClockService } from '../core/clock.service';
import { CreateNoteDto } from './create-note.dto';
import { Note, NoteStatus } from './note';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notes: Repository<Note>,
    private readonly clock: ClockService,
  ) {}

  findAll(): Promise<Note[]> {
    return this.notes.find({ order: { createdAt: 'DESC' } });
  }

  create(dto: CreateNoteDto): Promise<Note> {
    const now = this.clock.now();
    const note = this.notes.create({
      ...dto,
      status: dto.status ?? NoteStatus.Draft,
      createdAt: now,
      updatedAt: now,
    });

    return this.notes.save(note);
  }
}
