import { Injectable } from '@nestjs/common';

@Injectable()
export class OutboxMetricsService {
  private pendingEvents = 0;
  private publishedEvents = 0;
  private failedEvents = 0;
  private publishRetries = 0;

  setPendingEvents(total: number): void {
    this.pendingEvents = total;
  }

  incrementPublishedEvents(): void {
    this.publishedEvents += 1;
  }

  incrementFailedEvents(): void {
    this.failedEvents += 1;
  }

  incrementPublishRetries(): void {
    this.publishRetries += 1;
  }

  toPrometheusText(): string {
    return [
      '# HELP outbox_events_pending_total Current pending outbox events.',
      '# TYPE outbox_events_pending_total gauge',
      `outbox_events_pending_total ${this.pendingEvents}`,
      '# HELP outbox_events_published_total Published outbox events.',
      '# TYPE outbox_events_published_total counter',
      `outbox_events_published_total ${this.publishedEvents}`,
      '# HELP outbox_events_failed_total Failed outbox events.',
      '# TYPE outbox_events_failed_total counter',
      `outbox_events_failed_total ${this.failedEvents}`,
      '# HELP outbox_publish_retries_total Outbox publish retries.',
      '# TYPE outbox_publish_retries_total counter',
      `outbox_publish_retries_total ${this.publishRetries}`,
      '',
    ].join('\n');
  }
}
