import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/cache.module';
import { BackgroundJobsService } from './background-jobs.service';

@Module({
  imports: [CacheModule],
  providers: [BackgroundJobsService],
  exports: [BackgroundJobsService],
})
export class JobsModule {}
