import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClockService } from '../core/clock.service';
import { CreateNoteDto } from './create-note.dto';
import { ListNotesQueryDto } from './list-notes-query.dto';
import { Note, NoteStatus } from './note';
import { UpdateNoteDto } from './update-note.dto';

export interface PaginatedNotes {
  items: Note[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notes: Repository<Note>,
    private readonly clock: ClockService,
  ) {}

  async findAll(query: ListNotesQueryDto): Promise<PaginatedNotes> {
    const builder = this.notes.createQueryBuilder('note');

    if (query.status) {
      builder.andWhere('note.status = :status', { status: query.status });
    }
    if (query.search) {
      builder.andWhere(
        '(note.title LIKE :search OR note.content LIKE :search)',
        {
          search: `%${query.search}%`,
        },
      );
    }

    const [items, total] = await builder
      .orderBy('note.createdAt', 'DESC')
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getManyAndCount();

    return { items, total, page: query.page, pageSize: query.pageSize };
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.notes.findOneBy({ id });
    if (!note) {
      throw new NotFoundException(`Note ${id} was not found`);
    }
    return note;
  }

  create(dto: CreateNoteDto): Promise<Note> {
    const now = this.clock.now();
    return this.notes.save(
      this.notes.create({
        ...dto,
        status: dto.status ?? NoteStatus.Draft,
        createdAt: now,
        updatedAt: now,
      }),
    );
  }

  async update(id: string, dto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    Object.assign(note, dto, { updatedAt: this.clock.now() });
    return this.notes.save(note);
  }

  async remove(id: string): Promise<void> {
    const note = await this.findOne(id);
    await this.notes.remove(note);
  }
}
