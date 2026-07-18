import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { UserRole } from '../users/user';
import type { AuthenticatedUser } from './auth.types';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    })
      .overrideProvider(Reflector)
      .useValue({ getAllAndOverride: jest.fn() })
      .compile();
    guard = moduleRef.get(RolesGuard);
    reflector = moduleRef.get(Reflector);
  });

  const contextFor = (user: AuthenticatedUser): ExecutionContext =>
    ({
      getHandler: () => RolesGuard,
      getClass: () => RolesGuard,
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    }) as ExecutionContext;

  it('allows a user whose role is declared by metadata', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.Admin]);
    const admin = {
      id: 'admin-id',
      email: 'admin@example.com',
      role: UserRole.Admin,
    };
    expect(guard.canActivate(contextFor(admin))).toBe(true);
  });

  it('rejects an authenticated user without the required role', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.Admin]);
    const user = {
      id: 'user-id',
      email: 'user@example.com',
      role: UserRole.User,
    };
    expect(() => guard.canActivate(contextFor(user))).toThrow(
      ForbiddenException,
    );
  });
});
