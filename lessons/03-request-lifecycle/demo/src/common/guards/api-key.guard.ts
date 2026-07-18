import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expected = process.env.DEMO_API_KEY ?? 'learning-key';

    if (request.header('x-api-key') !== expected) {
      throw new UnauthorizedException('Invalid x-api-key');
    }

    return true;
  }
}
