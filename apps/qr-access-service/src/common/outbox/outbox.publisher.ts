import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { OutboxEvent } from './entities/outbox-event.entity';
import { OutboxStatus } from './enums/outbox-status.enum';
import {
  OUTBOX_MESSAGE_PUBLISHER,
  OutboxMessagePublisher,
} from './interfaces/outbox-message-publisher.interface';
import { OutboxMetricsService } from './outbox-metrics.service';
import { OutboxRepository } from './outbox.repository';

@Injectable()
export class OutboxPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxPublisher.name);
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(
    private readonly outboxRepository: OutboxRepository,
    private readonly metrics: OutboxMetricsService,
    @Inject(OUTBOX_MESSAGE_PUBLISHER)
    private readonly messagePublisher: OutboxMessagePublisher,
  ) {}

  onModuleInit(): void {
    if (process.env.OUTBOX_PUBLISHER_ENABLED === 'false') {
      this.logger.log('Outbox publisher is disabled by OUTBOX_PUBLISHER_ENABLED=false');
      return;
    }

    const intervalMs = Number(process.env.OUTBOX_PUBLISH_INTERVAL_MS ?? 5000);
    this.timer = setInterval(() => {
      void this.processPendingEvents();
    }, intervalMs);
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  async processPendingEvents(): Promise<void> {
    if (this.running) {
      return;
    }

    this.running = true;

    try {
      const limit = Number(process.env.OUTBOX_PUBLISH_BATCH_SIZE ?? 50);
      const pendingCount = await this.outboxRepository.countByStatus(OutboxStatus.PENDING);
      this.metrics.setPendingEvents(pendingCount);

      const events = await this.outboxRepository.claimPending(limit);

      for (const event of events) {
        await this.publishSingleEvent(event);
      }
    } finally {
      this.running = false;
    }
  }

  private async publishSingleEvent(event: OutboxEvent): Promise<void> {
    try {
      await this.messagePublisher.publish(event);
      await this.outboxRepository.markPublished(event);
      this.metrics.incrementPublishedEvents();
      this.logger.log(`Event published successfully: id=${event.id} type=${event.eventType}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown publish error';
      const updatedEvent = await this.outboxRepository.markPublishFailure(event, errorMessage);

      this.metrics.incrementPublishRetries();
      this.logger.error(
        `Event publish failed: id=${event.id} type=${event.eventType} retry=${updatedEvent.retryCount}/${updatedEvent.maxRetries} error=${errorMessage}`,
      );

      if (updatedEvent.status === OutboxStatus.FAILED) {
        this.metrics.incrementFailedEvents();
        this.logger.error(`Event moved to failed status: id=${event.id} type=${event.eventType}`);
      }
    }
  }
}
