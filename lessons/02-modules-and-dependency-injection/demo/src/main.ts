import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const prefix = configureApp(app);

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  Logger.log(
    `Lesson 02 is running at ${await app.getUrl()}/${prefix}`,
    'Bootstrap',
  );
}

void bootstrap();
