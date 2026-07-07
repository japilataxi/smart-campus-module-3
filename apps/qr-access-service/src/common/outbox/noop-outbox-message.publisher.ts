import { Injectable, Logger } from '@nestjs/common';

import { OutboxEvent } from './entities/outbox-event.entity';
import { OutboxMessagePublisher } from './interfaces/outbox-message-publisher.interface';

@Injectable()
export class NoopOutboxMessagePublisher implements OutboxMessagePublisher {
  private readonly logger = new Logger(NoopOutboxMessagePublisher.name);

  async publish(event: OutboxEvent): Promise<void> {
    this.logger.debug(
      `No broker publisher configured for outbox event ${event.id}. Override OUTBOX_MESSAGE_PUBLISHER in event-producing services.`,
    );
  }
}
