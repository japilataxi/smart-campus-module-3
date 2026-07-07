import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OutboxEvent } from './entities/outbox-event.entity';
import { OUTBOX_MESSAGE_PUBLISHER } from './interfaces/outbox-message-publisher.interface';
import { NoopOutboxMessagePublisher } from './noop-outbox-message.publisher';
import { OutboxHealthService } from './outbox-health.service';
import { OutboxMetricsService } from './outbox-metrics.service';
import { OutboxPublisher } from './outbox.publisher';
import { OutboxRepository } from './outbox.repository';
import { OutboxService } from './outbox.service';

@Module({
  imports: [TypeOrmModule.forFeature([OutboxEvent])],
  providers: [
    OutboxRepository,
    OutboxService,
    OutboxPublisher,
    OutboxMetricsService,
    OutboxHealthService,
    NoopOutboxMessagePublisher,
    {
      provide: OUTBOX_MESSAGE_PUBLISHER,
      useExisting: NoopOutboxMessagePublisher,
    },
  ],
  exports: [
    OutboxRepository,
    OutboxService,
    OutboxPublisher,
    OutboxMetricsService,
    OutboxHealthService,
    OUTBOX_MESSAGE_PUBLISHER,
  ],
})
export class OutboxModule {}
