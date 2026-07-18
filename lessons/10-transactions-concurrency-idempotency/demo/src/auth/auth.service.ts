import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { QueryFailedError, Repository } from 'typeorm';
import { User, UserRole } from '../users/user';
import type { AuthenticatedUser } from './auth.types';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';

export interface AuthResult {
  accessToken: string;
  user: AuthenticatedUser;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const email = dto.email.toLowerCase();
    if (await this.users.existsBy({ email })) {
      throw new ConflictException('Email is already registered');
    }

    let user: User;
    try {
      user = await this.users.save(
        this.users.create({
          email,
          passwordHash: await hash(dto.password, 12),
          role: UserRole.User,
        }),
      );
    } catch (error: unknown) {
      if (error instanceof QueryFailedError && /unique/i.test(error.message)) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }
    return this.createAuthResult(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.users.findOneBy({ email: dto.email.toLowerCase() });
    if (!user || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.createAuthResult(user);
  }

  private async createAuthResult(user: User): Promise<AuthResult> {
    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync({
      ...authenticatedUser,
      sub: user.id,
    });
    return { accessToken, user: authenticatedUser };
  }
}
