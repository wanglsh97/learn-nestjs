import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { InitialKnowledgeSchema1700000000000 } from './database/migrations/1700000000000-initial-knowledge-schema';
import { HealthModule } from './health/health.module';
import { Note } from './notes/note';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: process.env.DATABASE_PATH ?? 'lesson-05.sqlite',
      autoSave: true,
      entities: [Note],
      migrations: [InitialKnowledgeSchema1700000000000],
      migrationsRun: true,
      synchronize: false,
    }),
    HealthModule,
    NotesModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('{*path}');
  }
}
