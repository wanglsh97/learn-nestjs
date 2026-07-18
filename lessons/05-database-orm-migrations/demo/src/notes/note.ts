import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NoteStatus {
  Draft = 'draft',
  Published = 'published',
}

@Entity({ name: 'notes' })
export class Note {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column({ length: 100 })
  title!: string;

  @ApiProperty()
  @Column({ type: 'text' })
  content!: string;

  @ApiProperty({ enum: NoteStatus })
  @Column({ type: 'varchar', default: NoteStatus.Draft })
  status!: NoteStatus;

  @ApiProperty({ type: String, format: 'date-time' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
