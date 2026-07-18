import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [HealthModule, NotesModule],
  controllers: [AppController],
})
export class AppModule {}
