import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { CacheService } from '../cache/cache.service';
import { BackgroundJobsService } from '../jobs/background-jobs.service';

export interface ReadinessStatus {
  status: 'ok' | 'degraded';
  dependencies: {
    database: 'up' | 'down';
    cache: 'redis' | 'memory';
    queue: 'up' | 'down';
  };
}

@Injectable()
export class HealthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly cache: CacheService,
    private readonly jobs: BackgroundJobsService,
    private readonly config: ConfigService,
  ) {}

  async getReadiness(): Promise<ReadinessStatus> {
    let database: 'up' | 'down' = 'up';
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      database = 'down';
    }

    const redisConfigured = Boolean(this.config.get<string>('REDIS_URL'));
    const queue = this.jobs.isReady() ? 'up' : 'down';
    return {
      status: database === 'up' && queue === 'up' ? 'ok' : 'degraded',
      dependencies: {
        database,
        cache:
          redisConfigured && this.cache.isRedisReady() ? 'redis' : 'memory',
        queue,
      },
    };
  }
}
