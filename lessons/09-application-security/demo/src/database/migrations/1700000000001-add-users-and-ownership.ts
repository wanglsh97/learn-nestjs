import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddUsersAndOwnership1700000000001 implements MigrationInterface {
  name = 'AddUsersAndOwnership1700000000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'passwordHash', type: 'varchar' },
          { name: 'role', type: 'varchar', default: "'user'" },
          { name: 'createdAt', type: 'datetime' },
        ],
      }),
    );
    await queryRunner.addColumn(
      'notes',
      new TableColumn({ name: 'ownerId', type: 'varchar', isNullable: true }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('notes', 'ownerId');
    await queryRunner.dropTable('users');
  }
}
