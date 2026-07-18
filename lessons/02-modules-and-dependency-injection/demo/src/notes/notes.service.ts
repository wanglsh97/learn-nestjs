import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ClockService } from '../core/clock.service';
import { CreateNoteDto } from './create-note.dto';
import type { Note } from './note';

@Injectable()
export class NotesService {
  private readonly notes = new Map<string, Note>();

  constructor(private readonly clock: ClockService) {}

  findAll(): Note[] {
    return [...this.notes.values()];
  }

  create(dto: CreateNoteDto): Note {
    const note: Note = {
      id: randomUUID(),
      title: dto.title,
      content: dto.content,
      createdAt: this.clock.now(),
    };

    this.notes.set(note.id, note);
    return note;
  }
}
