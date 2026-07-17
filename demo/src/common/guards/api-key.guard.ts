import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expectedApiKey = this.configService.get<string>(
      'DEMO_API_KEY',
      'learning-key',
    );

    if (request.header('x-api-key') !== expectedApiKey) {
      throw new UnauthorizedException('缺少或使用了无效的 x-api-key');
    }

    return true;
  }
}
