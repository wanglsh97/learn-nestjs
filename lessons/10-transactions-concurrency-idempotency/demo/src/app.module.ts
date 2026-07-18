import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { InitialKnowledgeSchema1700000000000 } from './database/migrations/1700000000000-initial-knowledge-schema';
import { AddUsersAndOwnership1700000000001 } from './database/migrations/1700000000001-add-users-and-ownership';
import { AddPublishingRecords1700000000002 } from './database/migrations/1700000000002-add-publishing-records';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { Note } from './notes/note';
import { AuditLog } from './notes/audit-log';
import { IdempotencyRecord } from './notes/idempotency-record';
import { NotesModule } from './notes/notes.module';
import { User } from './users/user';
import { validateConfig } from './config/validate-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateConfig,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqljs' as const,
        location: config.get<string>('DATABASE_PATH', 'lesson-10.sqlite'),
        autoSave: true,
        entities: [AuditLog, IdempotencyRecord, Note, User],
        migrations: [
          InitialKnowledgeSchema1700000000000,
          AddUsersAndOwnership1700000000001,
          AddPublishingRecords1700000000002,
        ],
        migrationsRun: true,
        synchronize: false,
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    AuthModule,
    HealthModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('{*path}');
  }
}
