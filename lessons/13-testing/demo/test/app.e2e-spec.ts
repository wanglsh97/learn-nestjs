import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { existsSync, unlinkSync } from 'node:fs';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

describe('Knowledge API (e2e)', () => {
  let app: INestApplication<App>;
  const databasePath = process.env.DATABASE_PATH as string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  const register = async (email: string): Promise<string> => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password: 'secure-password' })
      .expect(201);
    return (response.body as { accessToken: string }).accessToken;
  };

  const createNote = async (token: string, title: string): Promise<string> => {
    const response = await request(app.getHttpServer())
      .post('/api/notes')
      .set('authorization', `Bearer ${token}`)
      .send({ title, content: 'Test behavior, not implementation.' })
      .expect(201);
    return (response.body as { id: string }).id;
  };

  it('rejects anonymous access', async () => {
    await request(app.getHttpServer()).get('/api/notes').expect(401);
  });

  it('registers a user and creates an owned note', async () => {
    const token = await register('create@example.com');
    const noteId = await createNote(token, 'Create flow');
    const page = await request(app.getHttpServer())
      .get('/api/notes')
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    const body = page.body as { total: number; items: Array<{ id: string }> };
    expect(body).toMatchObject({ total: 1 });
    expect(body.items[0]).toMatchObject({ id: noteId });
  });

  it('publishes idempotently and rejects key reuse for another note', async () => {
    const token = await register('publish@example.com');
    const firstId = await createNote(token, 'First publish');
    const secondId = await createNote(token, 'Second publish');
    const publish = (id: string) =>
      request(app.getHttpServer())
        .post(`/api/notes/${id}/publish`)
        .set('authorization', `Bearer ${token}`)
        .set('idempotency-key', 'publish-once');

    const first = await publish(firstId).expect(200);
    const replay = await publish(firstId).expect(200);
    await publish(secondId).expect(409);
    expect(first.body).toMatchObject({ id: firstId, status: 'published' });
    expect(replay.body).toMatchObject({ id: firstId, status: 'published' });
  });

  it('enforces ownership and administrator-only deletion', async () => {
    const ownerToken = await register('owner@example.com');
    const otherToken = await register('other@example.com');
    const noteId = await createNote(ownerToken, 'Permission boundary');

    await request(app.getHttpServer())
      .get(`/api/notes/${noteId}`)
      .set('authorization', `Bearer ${otherToken}`)
      .expect(404);
    await request(app.getHttpServer())
      .delete(`/api/notes/${noteId}`)
      .set('authorization', `Bearer ${ownerToken}`)
      .expect(403);
  });

  afterAll(async () => {
    await app.close();
    if (existsSync(databasePath)) {
      unlinkSync(databasePath);
    }
  });
});
