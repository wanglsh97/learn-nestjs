import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check application health' })
  getHealth(): { status: 'ok'; lesson: number; platform: 'express' } {
    return { status: 'ok', lesson: 11, platform: 'express' };
  }
}
