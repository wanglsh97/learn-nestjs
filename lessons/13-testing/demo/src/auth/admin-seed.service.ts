import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const email = this.config
      .get<string>('ADMIN_EMAIL', 'admin@example.com')
      .toLowerCase();
    if (await this.users.existsBy({ email })) {
      return;
    }

    const password = this.config.get<string>(
      'ADMIN_PASSWORD',
      'admin-password',
    );
    await this.users.save(
      this.users.create({
        email,
        passwordHash: await hash(password, 12),
        role: UserRole.Admin,
      }),
    );
  }
}
