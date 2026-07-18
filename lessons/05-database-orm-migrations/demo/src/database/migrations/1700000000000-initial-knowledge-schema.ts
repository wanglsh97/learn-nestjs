import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialKnowledgeSchema1700000000000 implements MigrationInterface {
  name = 'InitialKnowledgeSchema1700000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notes',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'title', type: 'varchar', length: '100' },
          { name: 'content', type: 'text' },
          { name: 'status', type: 'varchar', default: "'draft'" },
          { name: 'createdAt', type: 'datetime' },
          { name: 'updatedAt', type: 'datetime' },
        ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notes');
  }
}
