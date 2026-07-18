import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddPublishingRecords1700000000002 implements MigrationInterface {
  name = 'AddPublishingRecords1700000000002';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'action', type: 'varchar' },
          { name: 'userId', type: 'varchar' },
          { name: 'noteId', type: 'varchar' },
          { name: 'createdAt', type: 'datetime' },
        ],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'idempotency_records',
        columns: [
          { name: 'key', type: 'varchar', isPrimary: true },
          { name: 'userId', type: 'varchar' },
          { name: 'noteId', type: 'varchar' },
          { name: 'createdAt', type: 'datetime' },
        ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('idempotency_records');
    await queryRunner.dropTable('audit_logs');
  }
}
