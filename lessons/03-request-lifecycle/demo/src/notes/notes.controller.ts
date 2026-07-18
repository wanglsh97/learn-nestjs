import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TrimStringsPipe } from '../common/pipes/trim-strings.pipe';
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
  @UseGuards(ApiKeyGuard)
  create(@Body(TrimStringsPipe) dto: CreateNoteDto): Note {
    return this.notesService.create(dto);
  }
}
