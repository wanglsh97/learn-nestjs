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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import type { AuthenticatedUser } from '../auth/auth.types';
import { UserRole } from '../users/user';
import { CreateNoteDto } from './create-note.dto';
import { ListNotesQueryDto } from './list-notes-query.dto';
import { Note } from './note';
import { NotesService } from './notes.service';
import type { PaginatedNotes } from './notes.service';
import { UpdateNoteDto } from './update-note.dto';

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(
    @Query() query: ListNotesQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaginatedNotes> {
    return this.notesService.findAll(query, user);
  }

  @Get(':id')
  @ApiOkResponse({ type: Note })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Note> {
    return this.notesService.findOne(id, user);
  }

  @Post()
  @ApiCreatedResponse({ type: Note })
  create(
    @Body() dto: CreateNoteDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Note> {
    return this.notesService.create(dto, user);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Note })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Note> {
    return this.notesService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.notesService.remove(id, user);
  }
}
