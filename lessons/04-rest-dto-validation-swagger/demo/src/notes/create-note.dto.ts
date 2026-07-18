import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'Request lifecycle' })
  @IsString()
  @Length(1, 100)
  title!: string;

  @ApiProperty({ example: 'Middleware runs before guards.' })
  @IsString()
  @Length(1, 5000)
  content!: string;
}
