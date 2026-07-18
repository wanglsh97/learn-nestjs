function asString(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error('Configuration value must be a string');
  }
  return value;
}

function asCorsOrigins(value: unknown): string {
  const origins = asString(value)
    .split(',')
    .map((origin) => origin.trim());
  const invalid = origins.some((origin) => {
    try {
      const url = new URL(origin);
      return (
        !origin ||
        !['http:', 'https:'].includes(url.protocol) ||
        url.origin !== origin
      );
    } catch {
      return true;
    }
  });
  if (invalid) {
    throw new Error('CORS_ORIGINS must contain valid HTTP origins');
  }
  return origins.join(',');
}

export function validateConfig(
  values: Record<string, unknown>,
): Record<string, unknown> {
  const port = Number(values.PORT ?? 3014);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  const jwtSecret = asString(
    values.JWT_SECRET ?? 'development-secret-change-me',
  );
  if (jwtSecret.length < 16) {
    throw new Error('JWT_SECRET must contain at least 16 characters');
  }

  const redisUrl = asString(values.REDIS_URL ?? '');
  if (redisUrl) {
    try {
      const protocol = new URL(redisUrl).protocol;
      if (!['redis:', 'rediss:'].includes(protocol)) throw new Error();
    } catch {
      throw new Error('REDIS_URL must use the redis or rediss protocol');
    }
  }
  const cacheTtlSeconds = Number(values.CACHE_TTL_SECONDS ?? 60);
  if (!Number.isInteger(cacheTtlSeconds) || cacheTtlSeconds < 1) {
    throw new Error('CACHE_TTL_SECONDS must be a positive integer');
  }

  const queueName = asString(values.QUEUE_NAME ?? 'note-events').trim();
  if (!queueName) {
    throw new Error('QUEUE_NAME must not be empty');
  }

  return {
    ...values,
    PORT: port,
    APP_PREFIX: asString(values.APP_PREFIX ?? 'api'),
    DATABASE_PATH: asString(values.DATABASE_PATH ?? 'lesson-14.sqlite'),
    JWT_SECRET: jwtSecret,
    ADMIN_EMAIL: asString(values.ADMIN_EMAIL ?? 'admin@example.com'),
    ADMIN_PASSWORD: asString(values.ADMIN_PASSWORD ?? 'admin-password'),
    CORS_ORIGINS: asCorsOrigins(values.CORS_ORIGINS ?? 'http://localhost:3000'),
    REDIS_URL: redisUrl,
    CACHE_TTL_SECONDS: cacheTtlSeconds,
    QUEUE_NAME: queueName,
  };
}
