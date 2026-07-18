import type { UserRole } from '../users/user';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload extends AuthenticatedUser {
  sub: string;
}
