import { Logger } from '@nestjs/common';

import { OutboxEvent } from '../../src/common/outbox/entities/outbox-event.entity';
import { OutboxStatus } from '../../src/common/outbox/enums/outbox-status.enum';
import { OutboxMessagePublisher } from '../../src/common/outbox/interfaces/outbox-message-publisher.interface';
import { OutboxMetricsService } from '../../src/common/outbox/outbox-metrics.service';
import { OutboxPublisher } from '../../src/common/outbox/outbox.publisher';
import { OutboxRepository } from '../../src/common/outbox/outbox.repository';

const createEvent = (overrides: Partial<OutboxEvent> = {}): OutboxEvent => ({
  id: 'outbox-id',
  aggregateId: 'incident-id',
  aggregateType: 'Incident',
  eventType: 'incident.created',
  payload: { id: 'incident-id' },
  status: OutboxStatus.PROCESSING,
  retryCount: 0,
  maxRetries: 5,
  errorMessage: null,
  processedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('OutboxPublisher', () => {
  let repository: jest.Mocked<
    Pick<OutboxRepository, 'claimPending' | 'countByStatus' | 'markPublished' | 'markPublishFailure'>
  >;
  let metrics: jest.Mocked<OutboxMetricsService>;
  let messagePublisher: jest.Mocked<OutboxMessagePublisher>;
  let publisher: OutboxPublisher;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    repository = {
      claimPending: jest.fn(),
      countByStatus: jest.fn(),
      markPublished: jest.fn(),
      markPublishFailure: jest.fn(),
    };

    metrics = {
      setPendingEvents: jest.fn(),
      incrementPublishedEvents: jest.fn(),
      incrementFailedEvents: jest.fn(),
      incrementPublishRetries: jest.fn(),
      toPrometheusText: jest.fn(),
    } as unknown as jest.Mocked<OutboxMetricsService>;

    messagePublisher = {
      publish: jest.fn(),
    };

    publisher = new OutboxPublisher(
      repository as unknown as OutboxRepository,
      metrics,
      messagePublisher,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('publishes pending events and marks them as published', async () => {
    const event = createEvent();
    repository.countByStatus.mockResolvedValue(1);
    repository.claimPending.mockResolvedValue([event]);
    messagePublisher.publish.mockResolvedValue(undefined);
    repository.markPublished.mockResolvedValue({ ...event, status: OutboxStatus.PUBLISHED });

    await publisher.processPendingEvents();

    expect(repository.claimPending).toHaveBeenCalledWith(50);
    expect(messagePublisher.publish).toHaveBeenCalledWith(event);
    expect(repository.markPublished).toHaveBeenCalledWith(event);
    expect(metrics.incrementPublishedEvents).toHaveBeenCalledTimes(1);
  });

  it('returns failed publishes to pending while retries remain', async () => {
    const event = createEvent({ retryCount: 1, maxRetries: 5 });
    repository.countByStatus.mockResolvedValue(1);
    repository.claimPending.mockResolvedValue([event]);
    messagePublisher.publish.mockRejectedValue(new Error('RabbitMQ unavailable'));
    repository.markPublishFailure.mockResolvedValue({
      ...event,
      retryCount: 2,
      status: OutboxStatus.PENDING,
      errorMessage: 'RabbitMQ unavailable',
    });

    await publisher.processPendingEvents();

    expect(repository.markPublishFailure).toHaveBeenCalledWith(event, 'RabbitMQ unavailable');
    expect(metrics.incrementPublishRetries).toHaveBeenCalledTimes(1);
    expect(metrics.incrementFailedEvents).not.toHaveBeenCalled();
  });

  it('moves events to failed status when max retries is reached', async () => {
    const event = createEvent({ retryCount: 4, maxRetries: 5 });
    repository.countByStatus.mockResolvedValue(1);
    repository.claimPending.mockResolvedValue([event]);
    messagePublisher.publish.mockRejectedValue(new Error('Kafka unavailable'));
    repository.markPublishFailure.mockResolvedValue({
      ...event,
      retryCount: 5,
      status: OutboxStatus.FAILED,
      errorMessage: 'Kafka unavailable',
    });

    await publisher.processPendingEvents();

    expect(metrics.incrementPublishRetries).toHaveBeenCalledTimes(1);
    expect(metrics.incrementFailedEvents).toHaveBeenCalledTimes(1);
  });
});

