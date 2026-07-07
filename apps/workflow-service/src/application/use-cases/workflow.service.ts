import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { StructuredLogger } from '../../common/logging/structured-logger.service';
import { WorkflowExecution } from '../../domain/entities/workflow-execution.model';
import { WorkflowName } from '../../domain/enums/workflow-name.enum';
import { WorkflowStatus } from '../../domain/enums/workflow-status.enum';
import { WORKFLOW_EXECUTION_REPOSITORY } from '../../domain/repositories/workflow-execution.repository';
import type { WorkflowExecutionRepositoryPort } from '../../domain/repositories/workflow-execution.repository';
import { TriggerWorkflowDto } from '../dto/trigger-workflow.dto';
import { WorkflowEventDto } from '../dto/workflow-event.dto';
import { N8N_WEBHOOK_PORT } from '../ports/n8n-webhook.port';
import type { N8nWebhookPort } from '../ports/n8n-webhook.port';
import { WorkflowMetricsService } from '../ports/workflow-metrics.service';
import { WorkflowCacheService } from '../../infrastructure/cache/workflow-cache.service';

@Injectable()
export class WorkflowService {
  constructor(
    @Inject(WORKFLOW_EXECUTION_REPOSITORY)
    private readonly repository: WorkflowExecutionRepositoryPort,
    @Inject(N8N_WEBHOOK_PORT)
    private readonly n8nWebhook: N8nWebhookPort,
    private readonly cache: WorkflowCacheService,
    private readonly metrics: WorkflowMetricsService,
    private readonly logger: StructuredLogger,
  ) {}

  async trigger(dto: TriggerWorkflowDto): Promise<WorkflowExecution> {
    if (dto.idempotencyKey) {
      const existing = await this.cache.get<WorkflowExecution>(`workflow:idempotency:${dto.idempotencyKey}`);
      if (existing) return existing;
    }

    const startedAt = new Date();
    const execution = await this.repository.create({
      workflowName: dto.workflowName,
      sourceService: dto.sourceService,
      eventType: dto.eventType,
      status: WorkflowStatus.Pending,
      requestPayload: dto.requestPayload,
      triggeredByUserId: dto.triggeredByUserId || null,
      startedAt,
    });

    this.metrics.recordStarted(dto.workflowName);

    try {
      const responsePayload = await this.n8nWebhook.send(dto.workflowName, {
        executionId: execution.id,
        workflowName: dto.workflowName,
        sourceService: dto.sourceService,
        eventType: dto.eventType,
        triggeredByUserId: dto.triggeredByUserId,
        payload: dto.requestPayload,
        occurredAt: startedAt.toISOString(),
      });

      const finishedAt = new Date();
      const updated = await this.repository.update(execution.id, {
        status: WorkflowStatus.Success,
        responsePayload,
        finishedAt,
      });

      const result = updated || execution;
      await this.cacheRecent(result, dto.idempotencyKey);
      this.metrics.recordSuccess(dto.workflowName, this.duration(startedAt, finishedAt));
      this.logger.log(`Workflow ${dto.workflowName} executed successfully`, 'WorkflowService');
      return result;
    } catch (error: any) {
      const finishedAt = new Date();
      await this.cache.increment(`workflow:retry:${dto.workflowName}`, 3600);
      const updated = await this.repository.update(execution.id, {
        status: WorkflowStatus.Failed,
        errorMessage: error?.message || 'Workflow execution failed',
        responsePayload: error?.response || null,
        finishedAt,
      });

      const result = updated || execution;
      await this.cacheRecent(result, dto.idempotencyKey);
      this.metrics.recordFailure(dto.workflowName, this.duration(startedAt, finishedAt));
      this.logger.error(`Workflow ${dto.workflowName} failed`, error?.stack, 'WorkflowService');
      return result;
    }
  }

  async triggerIncidentCreated(dto: WorkflowEventDto): Promise<WorkflowExecution> {
    return this.trigger({
      workflowName: WorkflowName.IncidentCreated,
      sourceService: 'campus-incident-service',
      eventType: 'IncidentCreated',
      requestPayload: dto.payload,
      triggeredByUserId: dto.triggeredByUserId,
      idempotencyKey: dto.idempotencyKey || `incident-created:${dto.id}`,
    });
  }

  async triggerUserRegistered(dto: WorkflowEventDto): Promise<WorkflowExecution> {
    return this.trigger({
      workflowName: WorkflowName.UserRegistered,
      sourceService: 'auth-service',
      eventType: 'UserRegistered',
      requestPayload: dto.payload,
      triggeredByUserId: dto.triggeredByUserId,
      idempotencyKey: dto.idempotencyKey || `user-registered:${dto.id}`,
    });
  }

  async triggerLibraryLoanCreated(dto: WorkflowEventDto): Promise<WorkflowExecution> {
    return this.trigger({
      workflowName: WorkflowName.LibraryLoanCreated,
      sourceService: 'library-service',
      eventType: 'LibraryLoanCreated',
      requestPayload: dto.payload,
      triggeredByUserId: dto.triggeredByUserId,
      idempotencyKey: dto.idempotencyKey || `library-loan-created:${dto.id}`,
    });
  }

  async triggerCriticalNotification(dto: WorkflowEventDto): Promise<WorkflowExecution> {
    return this.trigger({
      workflowName: WorkflowName.CriticalNotification,
      sourceService: 'notification-service',
      eventType: 'CriticalNotificationCreated',
      requestPayload: dto.payload,
      triggeredByUserId: dto.triggeredByUserId,
      idempotencyKey: dto.idempotencyKey || `critical-notification:${dto.id}`,
    });
  }

  async findAll(limit = 50): Promise<WorkflowExecution[]> {
    const cacheKey = `workflow:executions:${limit}`;
    const cached = await this.cache.get<WorkflowExecution[]>(cacheKey);
    if (cached) return cached;

    const executions = await this.repository.findAll(limit);
    await this.cache.set(cacheKey, executions, 30);
    return executions;
  }

  async findById(id: string): Promise<WorkflowExecution> {
    const cacheKey = `workflow:execution:${id}`;
    const cached = await this.cache.get<WorkflowExecution>(cacheKey);
    if (cached) return cached;

    const execution = await this.repository.findById(id);
    if (!execution) throw new NotFoundException(`Workflow execution ${id} was not found`);

    await this.cache.set(cacheKey, execution, 60);
    return execution;
  }

  private async cacheRecent(execution: WorkflowExecution, idempotencyKey?: string): Promise<void> {
    await this.cache.set(`workflow:execution:${execution.id}`, execution, 300);
    if (idempotencyKey) {
      await this.cache.set(`workflow:idempotency:${idempotencyKey}`, execution, 600);
    }
  }

  private duration(startedAt: Date, finishedAt: Date): number {
    return (finishedAt.getTime() - startedAt.getTime()) / 1000;
  }
}
