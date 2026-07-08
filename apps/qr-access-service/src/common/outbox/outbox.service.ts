import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { OutboxEvent } from './entities/outbox-event.entity';
import { CreateOutboxEventInput } from './interfaces/create-outbox-event.input';
import { OutboxRepository } from './outbox.repository';

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async saveEvent(
    input: CreateOutboxEventInput,
    manager?: EntityManager,
  ): Promise<OutboxEvent> {
    const event = await this.outboxRepository.createPending(input, manager);

    this.logger.log(
      `Event saved to outbox: id=${event.id} type=${event.eventType} aggregate=${event.aggregateType}:${event.aggregateId}`,
    );

    return event;
  }

  async runInTransaction<T>(
    operation: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction(operation);
  }
}
