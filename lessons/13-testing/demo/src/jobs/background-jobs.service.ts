import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue, Worker } from 'bullmq';
import { createHash } from 'node:crypto';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CacheService } from '../cache/cache.service';
import type { Note } from '../notes/note';

interface NotePublishedJob {
  noteId: string;
  title: string;
  publishedBy: string;
}

@Injectable()
export class BackgroundJobsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BackgroundJobsService.name);
  private queue?: Queue<NotePublishedJob>;
  private worker?: Worker<NotePublishedJob>;
  private readonly fallbackJobIds = new Set<string>();

  constructor(
    private readonly config: ConfigService,
    private readonly cache: CacheService,
  ) {}

  onModuleInit(): void {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl || !this.cache.isRedisReady()) {
      this.logger.warn(
        'Queue uses an in-process fallback because Redis is offline',
      );
      return;
    }

    const url = new URL(redisUrl);
    const connection = {
      host: url.hostname,
      port: Number(url.port || 6379),
      username: url.username || undefined,
      password: url.password || undefined,
    };
    const queueName = this.config.get<string>('QUEUE_NAME', 'note-events');
    this.queue = new Queue(queueName, { connection });
    this.worker = new Worker<NotePublishedJob>(
      queueName,
      (job) => this.processNotePublished(job),
      { connection },
    );
    this.worker.on('failed', (job, error) => {
      this.logger.error(`Job ${job?.id ?? 'unknown'} failed: ${error.message}`);
    });
  }

  async enqueueNotePublished(
    note: Note,
    user: AuthenticatedUser,
    idempotencyKey: string,
  ): Promise<void> {
    const payload: NotePublishedJob = {
      noteId: note.id,
      title: note.title,
      publishedBy: user.id,
    };
    const jobId = createHash('sha256')
      .update(`${user.id}:${idempotencyKey.trim()}`)
      .digest('hex');

    if (this.queue) {
      await this.queue.add('note.published', payload, {
        jobId,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1_000 },
        removeOnComplete: { age: 86_400, count: 1_000 },
      });
      return;
    }

    if (this.fallbackJobIds.has(jobId)) {
      return;
    }
    this.fallbackJobIds.add(jobId);
    queueMicrotask(() => {
      this.logger.log(`Fallback job processed for note ${payload.noteId}`);
    });
  }

  isReady(): boolean {
    return Boolean(this.queue && this.worker) || !this.cache.isRedisReady();
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all([this.worker?.close(), this.queue?.close()]);
  }

  private processNotePublished(job: Job<NotePublishedJob>): Promise<void> {
    this.logger.log(
      `Notification generated for published note ${job.data.noteId}: ${job.data.title}`,
    );
    return Promise.resolve();
  }
}
