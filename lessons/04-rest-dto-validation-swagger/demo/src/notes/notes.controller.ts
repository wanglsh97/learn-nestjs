import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateNoteDto } from './create-note.dto';
import { Note } from './note';
import { NotesService } from './notes.service';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'List notes' })
  @ApiOkResponse({ type: Note, isArray: true })
  findAll(): Note[] {
    return this.notesService.findAll();
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Create a note' })
  @ApiCreatedResponse({ type: Note })
  create(@Body() dto: CreateNoteDto): Note {
    return this.notesService.create(dto);
  }
}
