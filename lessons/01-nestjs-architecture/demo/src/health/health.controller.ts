import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): { status: 'ok'; lesson: number; platform: 'express' } {
    return { status: 'ok', lesson: 1, platform: 'express' };
  }
}
