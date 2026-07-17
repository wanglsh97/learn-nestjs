import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note, NoteStatus } from './entities/note.entity';

@Injectable()
export class NotesService {
  private readonly notes = new Map<string, Note>();

  findAll(status?: NoteStatus): Note[] {
    return [...this.notes.values()].filter(
      (note) => status === undefined || note.status === status,
    );
  }

  findOne(id: string): Note {
    const note = this.notes.get(id);

    if (!note) {
      throw new NotFoundException(`未找到 ID 为 ${id} 的笔记`);
    }

    return note;
  }

  create(dto: CreateNoteDto): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      title: dto.title,
      content: dto.content,
      status: dto.status ?? NoteStatus.Draft,
      createdAt: now,
      updatedAt: now,
    };

    this.notes.set(note.id, note);
    return note;
  }

  update(id: string, dto: UpdateNoteDto): Note {
    const existing = this.findOne(id);
    const updated: Note = {
      ...existing,
      ...dto,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.notes.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    this.findOne(id);
    this.notes.delete(id);
  }
}
