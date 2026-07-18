import { validateConfig } from './validate-config';

describe('validateConfig', () => {
  it('normalizes valid values', () => {
    expect(
      validateConfig({ PORT: '4010', JWT_SECRET: 'a-secure-test-secret' }),
    ).toMatchObject({ PORT: 4010, JWT_SECRET: 'a-secure-test-secret' });
  });

  it('rejects an invalid port', () => {
    expect(() => validateConfig({ PORT: '70000' })).toThrow(
      'PORT must be an integer between 1 and 65535',
    );
  });

  it('rejects a weak JWT secret', () => {
    expect(() => validateConfig({ JWT_SECRET: 'short' })).toThrow(
      'JWT_SECRET must contain at least 16 characters',
    );
  });

  it('rejects invalid cache and queue configuration', () => {
    expect(() => validateConfig({ CACHE_TTL_SECONDS: '0' })).toThrow(
      'CACHE_TTL_SECONDS must be a positive integer',
    );
    expect(() => validateConfig({ QUEUE_NAME: ' ' })).toThrow(
      'QUEUE_NAME must not be empty',
    );
  });

  it('normalizes a strict CORS origin list', () => {
    expect(
      validateConfig({
        CORS_ORIGINS: 'http://localhost:3000, https://app.example.com',
      }).CORS_ORIGINS,
    ).toBe('http://localhost:3000,https://app.example.com');
    expect(() =>
      validateConfig({ CORS_ORIGINS: 'https://app.example.com/path' }),
    ).toThrow('CORS_ORIGINS must contain valid HTTP origins');
  });
});
