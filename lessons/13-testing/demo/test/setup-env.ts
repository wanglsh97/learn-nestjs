import { join } from 'node:path';
import { tmpdir } from 'node:os';

process.env.DATABASE_PATH = join(tmpdir(), `lesson-13-${process.pid}.sqlite`);
process.env.JWT_SECRET = 'e2e-test-secret-with-enough-length';
process.env.REDIS_URL = '';
process.env.ADMIN_PASSWORD = 'admin-password';
