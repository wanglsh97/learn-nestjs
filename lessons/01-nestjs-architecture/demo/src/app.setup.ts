import type { INestApplication } from '@nestjs/common';

export function configureApp(
  app: INestApplication,
  environment: NodeJS.ProcessEnv,
): string {
  const prefix = environment.APP_PREFIX ?? 'api';
  app.setGlobalPrefix(prefix);
  app.enableShutdownHooks();
  return prefix;
}
