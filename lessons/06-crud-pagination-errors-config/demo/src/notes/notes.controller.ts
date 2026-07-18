import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateNoteDto } from './create-note.dto';
import { ListNotesQueryDto } from './list-notes-query.dto';
import { Note } from './note';
import { NotesService, PaginatedNotes } from './notes.service';
import { UpdateNoteDto } from './update-note.dto';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'List, filter, and paginate notes' })
  findAll(@Query() query: ListNotesQueryDto): Promise<PaginatedNotes> {
    return this.notesService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Note })
  findOne(@Param('id') id: string): Promise<Note> {
    return this.notesService.findOne(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiCreatedResponse({ type: Note })
  create(@Body() dto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOkResponse({ type: Note })
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto): Promise<Note> {
    return this.notesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string): Promise<void> {
    return this.notesService.remove(id);
  }
}
