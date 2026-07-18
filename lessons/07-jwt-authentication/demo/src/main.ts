import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const prefix = configureApp(app);
  app.enableShutdownHooks();

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3007);
  await app.listen(port);
  Logger.log(
    'Lesson 7 is running at ' + (await app.getUrl()) + '/' + prefix,
    'Bootstrap',
  );
}

void bootstrap();
