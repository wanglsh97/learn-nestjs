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
import { CreateNoteDto } from './dto/create-note.dto';
import { ListNotesQueryDto } from './dto/list-notes-query.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { NotesService } from './notes.service';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: '查询笔记，可按状态过滤' })
  @ApiOkResponse({ type: Note, isArray: true })
  findAll(@Query() query: ListNotesQueryDto): Note[] {
    return this.notesService.findAll(query.status);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单篇笔记' })
  @ApiOkResponse({ type: Note })
  findOne(@Param('id') id: string): Note {
    return this.notesService.findOne(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: '创建笔记' })
  @ApiCreatedResponse({ type: Note })
  create(@Body() dto: CreateNoteDto): Note {
    return this.notesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: '更新笔记' })
  @ApiOkResponse({ type: Note })
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto): Note {
    return this.notesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除笔记' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string): void {
    this.notesService.remove(id);
  }
}
