import { Injectable } from '@nestjs/common';

@Injectable()
export class ClockService {
  now(): string {
    return new Date().toISOString();
  }
}
