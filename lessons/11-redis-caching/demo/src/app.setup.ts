import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { TrimStringsPipe } from './common/pipes/trim-strings.pipe';

export function configureApp(app: INestApplication): string {
  const configService = app.get(ConfigService);
  const prefix = configService.get<string>('APP_PREFIX', 'api');
  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(
    new TrimStringsPipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new RequestLoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Knowledge API')
    .setDescription('Cumulative NestJS course demo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  return prefix;
}
