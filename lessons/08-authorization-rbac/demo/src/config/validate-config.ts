function asString(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error('Configuration value must be a string');
  }
  return value;
}

export function validateConfig(
  values: Record<string, unknown>,
): Record<string, unknown> {
  const port = Number(values.PORT ?? 3008);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return {
    ...values,
    PORT: port,
    APP_PREFIX: asString(values.APP_PREFIX ?? 'api'),
    DATABASE_PATH: asString(values.DATABASE_PATH ?? 'lesson-08.sqlite'),
    JWT_SECRET: asString(values.JWT_SECRET ?? 'development-secret-change-me'),
    ADMIN_EMAIL: asString(values.ADMIN_EMAIL ?? 'admin@example.com'),
    ADMIN_PASSWORD: asString(values.ADMIN_PASSWORD ?? 'admin-password'),
  };
}
