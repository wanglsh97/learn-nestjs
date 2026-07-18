import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface MemoryEntry {
  value: string;
  expiresAt: number;
}

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly memory = new Map<string, MemoryEntry>();
  private redis?: Redis;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const url = this.config.get<string>('REDIS_URL');
    if (!url) {
      this.logger.warn('REDIS_URL is empty; using in-memory cache fallback');
      return;
    }

    const client = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 1_000,
    });
    try {
      await client.connect();
      this.redis = client;
    } catch {
      client.disconnect();
      this.logger.warn('Redis is unavailable; using in-memory cache fallback');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    let backend = this.redis ? 'redis' : 'memory';
    let serialized: string | null;
    try {
      serialized = this.redis
        ? await this.redis.get(key)
        : this.getMemoryValue(key);
    } catch {
      this.disableRedis();
      backend = 'memory';
      serialized = this.getMemoryValue(key);
    }
    this.logger.log(
      `Cache ${serialized ? 'hit' : 'miss'} (${backend}) for ${key.split(':', 1)[0]}`,
    );
    return serialized ? (JSON.parse(serialized) as T) : null;
  }

  async set(key: string, value: unknown): Promise<void> {
    const serialized = JSON.stringify(value);
    const ttl = this.config.get<number>('CACHE_TTL_SECONDS', 60);
    if (this.redis) {
      try {
        await this.redis.set(key, serialized, 'EX', ttl);
        return;
      } catch {
        this.disableRedis();
      }
    }
    this.memory.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttl * 1_000,
    });
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    if (this.redis) {
      try {
        const keys = await this.redis.keys(`${prefix}*`);
        if (keys.length) {
          await this.redis.del(...keys);
        }
        return;
      } catch {
        this.disableRedis();
      }
    }
    for (const key of this.memory.keys()) {
      if (key.startsWith(prefix)) {
        this.memory.delete(key);
      }
    }
  }

  isRedisReady(): boolean {
    return this.redis?.status === 'ready';
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }

  private getMemoryValue(key: string): string | null {
    const entry = this.memory.get(key);
    if (!entry || entry.expiresAt <= Date.now()) {
      this.memory.delete(key);
      return null;
    }
    return entry.value;
  }

  private disableRedis(): void {
    this.redis?.disconnect();
    this.redis = undefined;
    this.logger.warn('Redis operation failed; switched to in-memory fallback');
  }
}
