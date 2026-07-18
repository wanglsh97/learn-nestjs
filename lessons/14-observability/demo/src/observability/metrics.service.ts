import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private requestCount = 0;
  private errorCount = 0;
  private totalDurationMs = 0;

  record(statusCode: number, durationMs: number): void {
    this.requestCount += 1;
    this.totalDurationMs += durationMs;
    if (statusCode >= 500) {
      this.errorCount += 1;
    }
  }

  render(): string {
    return [
      '# HELP knowledge_http_requests_total Total HTTP requests',
      '# TYPE knowledge_http_requests_total counter',
      `knowledge_http_requests_total ${this.requestCount}`,
      '# HELP knowledge_http_errors_total Total HTTP 5xx responses',
      '# TYPE knowledge_http_errors_total counter',
      `knowledge_http_errors_total ${this.errorCount}`,
      '# HELP knowledge_http_duration_ms_total Cumulative request duration',
      '# TYPE knowledge_http_duration_ms_total counter',
      `knowledge_http_duration_ms_total ${this.totalDurationMs}`,
    ].join('\n');
  }
}
