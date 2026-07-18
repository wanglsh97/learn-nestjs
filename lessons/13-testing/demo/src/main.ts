import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const prefix = configureApp(app);
  app.use(helmet());
  const config = app.get(ConfigService);
  app.enableCors({
    origin: config
      .get<string>('CORS_ORIGINS', 'http://localhost:3000')
      .split(','),
    credentials: true,
  });
  app.enableShutdownHooks();

  const port = config.get<number>('PORT', 3013);
  await app.listen(port);
  Logger.log(
    'Lesson 13 is running at ' + (await app.getUrl()) + '/' + prefix,
    'Bootstrap',
  );
}

void bootstrap();
