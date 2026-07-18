import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expected = this.configService.get<string>(
      'DEMO_API_KEY',
      'learning-key',
    );

    if (request.header('x-api-key') !== expected) {
      throw new UnauthorizedException('Invalid x-api-key');
    }

    return true;
  }
}
