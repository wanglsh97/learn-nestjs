import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  QueryFailedError,
  Repository,
} from 'typeorm';
import type { AuthenticatedUser } from '../auth/auth.types';
import { ClockService } from '../core/clock.service';
import { UserRole } from '../users/user';
import { AuditLog } from './audit-log';
import { CreateNoteDto } from './create-note.dto';
import { IdempotencyRecord } from './idempotency-record';
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
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: ListNotesQueryDto,
    user: AuthenticatedUser,
  ): Promise<PaginatedNotes> {
    const builder = this.notes.createQueryBuilder('note');
    if (user.role !== UserRole.Admin) {
      builder.where('note.ownerId = :ownerId', { ownerId: user.id });
    }
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

  async findOne(id: string, user: AuthenticatedUser): Promise<Note> {
    const note = await this.notes.findOneBy({ id });
    this.assertCanAccess(note, id, user);
    return note;
  }

  create(dto: CreateNoteDto, user: AuthenticatedUser): Promise<Note> {
    const now = this.clock.now();
    return this.notes.save(
      this.notes.create({
        ...dto,
        ownerId: user.id,
        status: dto.status ?? NoteStatus.Draft,
        createdAt: now,
        updatedAt: now,
      }),
    );
  }

  async update(
    id: string,
    dto: UpdateNoteDto,
    user: AuthenticatedUser,
  ): Promise<Note> {
    const note = await this.findOne(id, user);
    Object.assign(note, dto, { updatedAt: this.clock.now() });
    return this.notes.save(note);
  }

  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    const note = await this.findOne(id, user);
    await this.notes.remove(note);
  }

  async publish(
    id: string,
    idempotencyKey: string | undefined,
    user: AuthenticatedUser,
  ): Promise<Note> {
    if (!idempotencyKey?.trim()) {
      throw new BadRequestException('idempotency-key header is required');
    }
    const scopedKey = `${user.id}:${idempotencyKey.trim()}`;

    try {
      return await this.dataSource.transaction(async (manager) => {
        const existing = await manager.findOneBy(IdempotencyRecord, {
          key: scopedKey,
        });
        if (existing) {
          return this.loadIdempotentResult(manager, existing, id, user);
        }

        const note = await manager.findOneBy(Note, { id });
        this.assertCanAccess(note, id, user);
        note.status = NoteStatus.Published;
        note.updatedAt = this.clock.now();
        await manager.save(note);

        await this.writePublishingRecords(manager, scopedKey, note, user);
        return note;
      });
    } catch (error: unknown) {
      if (error instanceof QueryFailedError && /unique/i.test(error.message)) {
        const existing = await this.dataSource.manager.findOneBy(
          IdempotencyRecord,
          { key: scopedKey },
        );
        if (existing) {
          return this.loadIdempotentResult(
            this.dataSource.manager,
            existing,
            id,
            user,
          );
        }
      }
      throw error;
    }
  }

  private async loadIdempotentResult(
    manager: EntityManager,
    record: IdempotencyRecord,
    requestedNoteId: string,
    user: AuthenticatedUser,
  ): Promise<Note> {
    if (record.noteId !== requestedNoteId) {
      throw new ConflictException(
        'Idempotency key was already used for another note',
      );
    }
    const previous = await manager.findOneBy(Note, { id: record.noteId });
    this.assertCanAccess(previous, record.noteId, user);
    return previous;
  }

  private async writePublishingRecords(
    manager: EntityManager,
    key: string,
    note: Note,
    user: AuthenticatedUser,
  ): Promise<void> {
    await manager.save(
      manager.create(AuditLog, {
        action: 'note.published',
        noteId: note.id,
        userId: user.id,
      }),
    );
    await manager.save(
      manager.create(IdempotencyRecord, {
        key,
        noteId: note.id,
        userId: user.id,
      }),
    );
  }

  private assertCanAccess(
    note: Note | null,
    id: string,
    user: AuthenticatedUser,
  ): asserts note is Note {
    if (!note || (user.role !== UserRole.Admin && note.ownerId !== user.id)) {
      throw new NotFoundException(`Note ${id} was not found`);
    }
  }
}
