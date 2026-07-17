import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { NoteStatus } from '../entities/note.entity';

export class CreateNoteDto {
  @ApiProperty({ example: 'Provider 与依赖注入' })
  @IsString()
  @Length(1, 100)
  title!: string;

  @ApiProperty({ example: 'Provider 默认是单例，可通过构造函数注入。' })
  @IsString()
  @Length(1, 5000)
  content!: string;

  @ApiPropertyOptional({ enum: NoteStatus, default: NoteStatus.Draft })
  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus;
}
