function asString(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error('Configuration value must be a string');
  }
  return value;
}

export function validateConfig(
  values: Record<string, unknown>,
): Record<string, unknown> {
  const port = Number(values.PORT ?? 3006);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return {
    ...values,
    PORT: port,
    APP_PREFIX: asString(values.APP_PREFIX ?? 'api'),
    DEMO_API_KEY: asString(values.DEMO_API_KEY ?? 'learning-key'),
    DATABASE_PATH: asString(values.DATABASE_PATH ?? 'lesson-06.sqlite'),
  };
}
