import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { NoteStatus } from './note';

export class CreateNoteDto {
  @ApiProperty({ example: 'Request lifecycle' })
  @IsString()
  @Length(1, 100)
  title!: string;

  @ApiProperty({ example: 'Middleware runs before guards.' })
  @IsString()
  @Length(1, 5000)
  content!: string;

  @ApiPropertyOptional({ enum: NoteStatus, default: NoteStatus.Draft })
  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus;
}
