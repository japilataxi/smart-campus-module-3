import { Test } from '@nestjs/testing';
import { StructuredLogger } from '../../common/logging/structured-logger.service';
import { WorkflowStatus } from '../../domain/enums/workflow-status.enum';
import { WORKFLOW_EXECUTION_REPOSITORY } from '../../domain/repositories/workflow-execution.repository';
import { N8N_WEBHOOK_PORT } from '../ports/n8n-webhook.port';
import { WorkflowMetricsService } from '../ports/workflow-metrics.service';
import { WorkflowService } from './workflow.service';
import { WorkflowCacheService } from '../../infrastructure/cache/workflow-cache.service';

const execution = {
  id: 'execution-1',
  workflowName: 'incident-created-workflow',
  sourceService: 'campus-incident-service',
  eventType: 'IncidentCreated',
  status: WorkflowStatus.Pending,
  requestPayload: { id: 'incident-1' },
  responsePayload: null,
  errorMessage: null,
  triggeredByUserId: null,
  startedAt: new Date(),
  finishedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('WorkflowService', () => {
  let service: WorkflowService;
  const repository = {
    create: jest.fn().mockResolvedValue(execution),
    update: jest.fn().mockImplementation((_id, input) => Promise.resolve({ ...execution, ...input })),
    findAll: jest.fn().mockResolvedValue([execution]),
    findById: jest.fn().mockResolvedValue(execution),
  };
  const n8nWebhook = { send: jest.fn().mockResolvedValue({ ok: true }) };
  const cache = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    increment: jest.fn().mockResolvedValue(1),
  };
  const metrics = {
    recordStarted: jest.fn(),
    recordSuccess: jest.fn(),
    recordFailure: jest.fn(),
  };
  const logger = { log: jest.fn(), error: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        WorkflowService,
        { provide: WORKFLOW_EXECUTION_REPOSITORY, useValue: repository },
        { provide: N8N_WEBHOOK_PORT, useValue: n8nWebhook },
        { provide: WorkflowCacheService, useValue: cache },
        { provide: WorkflowMetricsService, useValue: metrics },
        { provide: StructuredLogger, useValue: logger },
      ],
    }).compile();

    service = moduleRef.get(WorkflowService);
  });

  it('triggers a workflow and stores success result', async () => {
    const result = await service.trigger({
      workflowName: 'incident-created-workflow' as any,
      sourceService: 'campus-incident-service',
      eventType: 'IncidentCreated',
      requestPayload: { id: 'incident-1' },
    });

    expect(repository.create).toHaveBeenCalled();
    expect(n8nWebhook.send).toHaveBeenCalled();
    expect(result.status).toBe(WorkflowStatus.Success);
  });

  it('returns cached execution for idempotency key', async () => {
    cache.get.mockResolvedValueOnce(execution);

    const result = await service.trigger({
      workflowName: 'incident-created-workflow' as any,
      sourceService: 'campus-incident-service',
      eventType: 'IncidentCreated',
      requestPayload: { id: 'incident-1' },
      idempotencyKey: 'same-event',
    });

    expect(result).toBe(execution);
    expect(n8nWebhook.send).not.toHaveBeenCalled();
  });
});
