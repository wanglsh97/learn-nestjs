import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { NoteStatus } from '../entities/note.entity';

export class ListNotesQueryDto {
  @ApiPropertyOptional({ enum: NoteStatus })
  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus;
}
