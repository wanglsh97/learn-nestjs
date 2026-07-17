import { NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteStatus } from './entities/note.entity';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(() => {
    service = new NotesService();
  });

  it('creates and reads a note', () => {
    const dto: CreateNoteDto = {
      title: 'Module',
      content: 'Module is an application boundary.',
    };

    const created = service.create(dto);

    expect(created.status).toBe(NoteStatus.Draft);
    expect(service.findOne(created.id)).toEqual(created);
  });

  it('filters notes by status', () => {
    service.create({ title: 'Draft', content: 'content' });
    service.create({
      title: 'Published',
      content: 'content',
      status: NoteStatus.Published,
    });

    expect(service.findAll(NoteStatus.Published)).toHaveLength(1);
  });

  it('throws when a note does not exist', () => {
    expect(() => service.findOne('missing')).toThrow(NotFoundException);
  });
});
