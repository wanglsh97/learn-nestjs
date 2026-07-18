import type { INestApplication } from '@nestjs/common';

export function configureApp(app: INestApplication): string {
  const prefix = process.env.APP_PREFIX ?? 'api';
  app.setGlobalPrefix(prefix);
  app.enableShutdownHooks();
  return prefix;
}
