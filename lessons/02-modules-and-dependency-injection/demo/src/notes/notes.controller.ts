import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateNoteDto } from './create-note.dto';
import type { Note } from './note';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(): Note[] {
    return this.notesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateNoteDto): Note {
    return this.notesService.create(dto);
  }
}
