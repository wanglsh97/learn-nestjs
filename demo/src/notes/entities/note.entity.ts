import { ApiProperty } from '@nestjs/swagger';

export enum NoteStatus {
  Draft = 'draft',
  Published = 'published',
}

export class Note {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty({ enum: NoteStatus })
  status!: NoteStatus;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
