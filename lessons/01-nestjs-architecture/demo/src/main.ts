import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { env } from 'node:process';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const prefix = configureApp(app, env);

  const port = Number(env.PORT ?? 3001);
  await app.listen(port);
  Logger.log(
    `Lesson 01 is running at ${await app.getUrl()}/${prefix}`,
    'Bootstrap',
  );
}

void bootstrap();
