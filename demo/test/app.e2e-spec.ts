import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

describe('Learning demo (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('reports its health', async () => {
    await request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({ status: 'ok' });
      });
  });

  it('protects write endpoints with an API key', async () => {
    await request(app.getHttpServer())
      .post('/api/notes')
      .send({ title: 'Guard', content: 'Protects a route.' })
      .expect(401);
  });

  it('validates and creates a note', async () => {
    await request(app.getHttpServer())
      .post('/api/notes')
      .set('x-api-key', 'learning-key')
      .send({ title: '', content: 'Invalid title.' })
      .expect(400);

    await request(app.getHttpServer())
      .post('/api/notes')
      .set('x-api-key', 'learning-key')
      .send({ title: 'Pipe', content: 'Validates incoming data.' })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({ title: 'Pipe', status: 'draft' });
      });

    await request(app.getHttpServer())
      .get('/api/notes?status=draft')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
