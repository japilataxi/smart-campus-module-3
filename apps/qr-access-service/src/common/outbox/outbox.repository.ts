import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { OutboxEvent } from './entities/outbox-event.entity';
import { OutboxStatus } from './enums/outbox-status.enum';
import { CreateOutboxEventInput } from './interfaces/create-outbox-event.input';

@Injectable()
export class OutboxRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OutboxEvent)
    private readonly repository: Repository<OutboxEvent>,
  ) {}

  async createPending(
    input: CreateOutboxEventInput,
    manager?: EntityManager,
  ): Promise<OutboxEvent> {
    const repository = this.getRepository(manager);
    const event = repository.create({
      aggregateId: input.aggregateId,
      aggregateType: input.aggregateType,
      eventType: input.eventType,
      payload: input.payload,
      maxRetries: input.maxRetries ?? 5,
      status: OutboxStatus.PENDING,
    });

    return repository.save(event);
  }

  async claimPending(limit: number): Promise<OutboxEvent[]> {
    return this.dataSource.transaction(async (manager) => {
      const repository = this.getRepository(manager);
      const events = await repository
        .createQueryBuilder('event')
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .where('event.status = :status', { status: OutboxStatus.PENDING })
        .andWhere('event.retryCount < event.maxRetries')
        .orderBy('event.createdAt', 'ASC')
        .limit(limit)
        .getMany();

      if (events.length === 0) {
        return [];
      }

      const processingEvents = events.map((event) => ({
        ...event,
        status: OutboxStatus.PROCESSING,
        errorMessage: null,
      }));

      return repository.save(processingEvents);
    });
  }

  async markPublished(event: OutboxEvent): Promise<OutboxEvent> {
    return this.repository.save({
      ...event,
      status: OutboxStatus.PUBLISHED,
      processedAt: new Date(),
      errorMessage: null,
    });
  }

  async markPublishFailure(
    event: OutboxEvent,
    errorMessage: string,
  ): Promise<OutboxEvent> {
    const retryCount = event.retryCount + 1;
    const status = retryCount >= event.maxRetries ? OutboxStatus.FAILED : OutboxStatus.PENDING;

    return this.repository.save({
      ...event,
      retryCount,
      status,
      errorMessage,
      processedAt: status === OutboxStatus.FAILED ? new Date() : null,
    });
  }

  async countByStatus(status: OutboxStatus): Promise<number> {
    return this.repository.count({ where: { status } });
  }

  private getRepository(manager?: EntityManager): Repository<OutboxEvent> {
    return manager ? manager.getRepository(OutboxEvent) : this.repository;
  }
}
