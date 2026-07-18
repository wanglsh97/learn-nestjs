import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { CacheModule } from '../cache/cache.module';
import { JobsModule } from '../jobs/jobs.module';
import { HealthService } from './health.service';

@Module({
  imports: [CacheModule, JobsModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
