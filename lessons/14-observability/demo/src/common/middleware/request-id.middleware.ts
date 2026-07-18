import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { MetricsService } from '../../observability/metrics.service';

type ObservedRequest = Request & {
  requestId: string;
  user?: { id: string };
};

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestIdMiddleware.name);

  constructor(private readonly metrics: MetricsService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const candidate = request.header('x-request-id');
    const requestId =
      candidate && /^[A-Za-z0-9._:-]{1,128}$/.test(candidate)
        ? candidate
        : randomUUID();
    const observedRequest = request as ObservedRequest;
    observedRequest.requestId = requestId;
    response.setHeader('x-request-id', requestId);
    const startedAt = Date.now();
    response.once('finish', () => {
      const durationMs = Date.now() - startedAt;
      this.metrics.record(response.statusCode, durationMs);
      this.logger.log(
        JSON.stringify({
          requestId,
          userId: observedRequest.user?.id,
          method: request.method,
          path: request.path,
          statusCode: response.statusCode,
          durationMs,
        }),
      );
    });
    next();
  }
}
