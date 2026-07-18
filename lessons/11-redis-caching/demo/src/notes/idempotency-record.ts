import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'idempotency_records' })
export class IdempotencyRecord {
  @PrimaryColumn()
  key!: string;

  @Column()
  userId!: string;

  @Column()
  noteId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
