import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import type { ReadinessStatus } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check application health' })
  getHealth(): { status: 'ok'; lesson: number; platform: 'express' } {
    return { status: 'ok', lesson: 14, platform: 'express' };
  }

  @Get('live')
  @ApiOperation({ summary: 'Process liveness check' })
  getLiveness(): { status: 'ok'; lesson: number } {
    return { status: 'ok', lesson: 14 };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Dependency readiness check' })
  getReadiness(): Promise<ReadinessStatus> {
    return this.health.getReadiness();
  }
}
