import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { InitialKnowledgeSchema1700000000000 } from './database/migrations/1700000000000-initial-knowledge-schema';
import { HealthModule } from './health/health.module';
import { Note } from './notes/note';
import { NotesModule } from './notes/notes.module';
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
        location: config.get<string>('DATABASE_PATH', 'lesson-06.sqlite'),
        autoSave: true,
        entities: [Note],
        migrations: [InitialKnowledgeSchema1700000000000],
        migrationsRun: true,
        synchronize: false,
      }),
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
