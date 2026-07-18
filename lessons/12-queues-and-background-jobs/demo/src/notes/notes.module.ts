import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '../cache/cache.module';
import { ClockModule } from '../core/clock.module';
import { JobsModule } from '../jobs/jobs.module';
import { Note } from './note';
import { AuditLog } from './audit-log';
import { IdempotencyRecord } from './idempotency-record';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [
    AuthModule,
    CacheModule,
    ClockModule,
    JobsModule,
    TypeOrmModule.forFeature([AuditLog, IdempotencyRecord, Note]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
