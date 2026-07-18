import { ApiProperty } from '@nestjs/swagger';

export class Note {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  createdAt!: string;
}
