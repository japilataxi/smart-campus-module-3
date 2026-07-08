import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { OutboxStatus } from './enums/outbox-status.enum';
import { OutboxRepository } from './outbox.repository';

export interface OutboxHealth {
  database: 'up' | 'down';
  pendingEvents: number;
  failedEvents: number;
}

@Injectable()
export class OutboxHealthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async getHealth(): Promise<OutboxHealth> {
    const database = this.dataSource.isInitialized ? 'up' : 'down';
    const [pendingEvents, failedEvents] = await Promise.all([
      this.outboxRepository.countByStatus(OutboxStatus.PENDING),
      this.outboxRepository.countByStatus(OutboxStatus.FAILED),
    ]);

    return {
      database,
      pendingEvents,
      failedEvents,
    };
  }
}
