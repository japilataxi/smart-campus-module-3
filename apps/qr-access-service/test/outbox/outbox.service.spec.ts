import { Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { OutboxStatus } from '../../src/common/outbox/enums/outbox-status.enum';
import { OutboxRepository } from '../../src/common/outbox/outbox.repository';
import { OutboxService } from '../../src/common/outbox/outbox.service';

const createSavedEvent = (aggregateId = 'incident-id') => ({
  id: 'outbox-id',
  aggregateId,
  aggregateType: 'Incident',
  eventType: 'incident.created',
  payload: { id: aggregateId },
  status: OutboxStatus.PENDING,
  retryCount: 0,
  maxRetries: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('OutboxService', () => {
  let dataSource: jest.Mocked<Pick<DataSource, 'transaction'>>;
  let repository: jest.Mocked<Pick<OutboxRepository, 'createPending'>>;
  let service: OutboxService;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

    dataSource = {
      transaction: jest.fn(),
    };

    repository = {
      createPending: jest.fn(),
    };

    service = new OutboxService(
      dataSource as unknown as DataSource,
      repository as unknown as OutboxRepository,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('saves an outbox event with the provided transaction manager', async () => {
    const manager = {} as EntityManager;
    const event = createSavedEvent();

    repository.createPending.mockResolvedValue(event);

    await expect(
      service.saveEvent(
        {
          aggregateId: 'incident-id',
          aggregateType: 'Incident',
          eventType: 'incident.created',
          payload: { id: 'incident-id' },
        },
        manager,
      ),
    ).resolves.toEqual(event);

    expect(repository.createPending).toHaveBeenCalledWith(
      {
        aggregateId: 'incident-id',
        aggregateType: 'Incident',
        eventType: 'incident.created',
        payload: { id: 'incident-id' },
      },
      manager,
    );
  });

  it('runs business logic inside the database transaction', async () => {
    const manager = { save: jest.fn() } as unknown as EntityManager;
    repository.createPending.mockResolvedValue(createSavedEvent('business-id'));
    dataSource.transaction.mockImplementation(async (operationOrIsolation, maybeOperation?) => {
      const operation = typeof operationOrIsolation === 'function' ? operationOrIsolation : maybeOperation;
      return operation!(manager);
    });

    await service.runInTransaction(async (transactionManager) => {
      await transactionManager.save({ id: 'business-id' });
      await service.saveEvent(
        {
          aggregateId: 'business-id',
          aggregateType: 'Incident',
          eventType: 'incident.created',
          payload: { id: 'business-id' },
        },
        transactionManager,
      );
    });

    expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    expect(manager.save).toHaveBeenCalledWith({ id: 'business-id' });
    expect(repository.createPending).toHaveBeenCalledTimes(1);
  });

  it('does not create an outbox event when the business transaction fails before the event is saved', async () => {
    const manager = { save: jest.fn() } as unknown as EntityManager;
    dataSource.transaction.mockImplementation(async (operationOrIsolation, maybeOperation?) => {
      const operation = typeof operationOrIsolation === 'function' ? operationOrIsolation : maybeOperation;
      return operation!(manager);
    });

    await expect(
      service.runInTransaction(async (transactionManager) => {
        await transactionManager.save({ id: 'business-id' });
        throw new Error('business transaction failed');
      }),
    ).rejects.toThrow('business transaction failed');

    expect(repository.createPending).not.toHaveBeenCalled();
  });
});
