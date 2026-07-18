import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from '../users/user';

describe('AuthService integration', () => {
  let moduleRef: TestingModule;
  let service: AuthService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          dropSchema: true,
          synchronize: true,
          entities: [User],
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({ secret: 'integration-secret-with-enough-length' }),
      ],
      providers: [AuthService],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  it('persists a normalized user and logs in against the password hash', async () => {
    const registered = await service.register({
      email: 'Learner@Example.com',
      password: 'secure-password',
    });
    expect(registered.user.email).toBe('learner@example.com');
    expect(registered.accessToken).toEqual(expect.any(String));

    const loggedIn = await service.login({
      email: 'LEARNER@example.com',
      password: 'secure-password',
    });
    expect(loggedIn.user.id).toBe(registered.user.id);
  });

  it('maps duplicate and invalid credentials to domain HTTP errors', async () => {
    const email = 'duplicate@example.com';
    await service.register({ email, password: 'secure-password' });

    await expect(
      service.register({
        email,
        password: 'secure-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    await expect(
      service.login({
        email,
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  afterAll(async () => {
    await moduleRef.close();
  });
});
