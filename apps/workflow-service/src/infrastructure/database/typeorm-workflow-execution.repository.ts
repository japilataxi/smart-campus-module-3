import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { WorkflowExecution } from '../../domain/entities/workflow-execution.model';
import {
  CreateWorkflowExecutionInput,
  UpdateWorkflowExecutionInput,
  WorkflowExecutionRepositoryPort,
} from '../../domain/repositories/workflow-execution.repository';
import { WorkflowExecutionEntity } from './workflow-execution.entity';

@Injectable()
export class TypeOrmWorkflowExecutionRepository implements WorkflowExecutionRepositoryPort {
  constructor(
    @InjectRepository(WorkflowExecutionEntity)
    private readonly repository: Repository<WorkflowExecutionEntity>,
  ) {}

  async create(input: CreateWorkflowExecutionInput): Promise<WorkflowExecution> {
    const entity = this.repository.create(input);
    return this.toDomain(await this.repository.save(entity));
  }

  async findAll(limit = 50): Promise<WorkflowExecution[]> {
    const executions = await this.repository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return executions.map((execution) => this.toDomain(execution));
  }

  async findById(id: string): Promise<WorkflowExecution | null> {
    const execution = await this.repository.findOne({ where: { id } });
    return execution ? this.toDomain(execution) : null;
  }

  async update(id: string, input: UpdateWorkflowExecutionInput): Promise<WorkflowExecution | null> {
    await this.repository.update(id, input as QueryDeepPartialEntity<WorkflowExecutionEntity>);
    return this.findById(id);
  }

  private toDomain(entity: WorkflowExecutionEntity): WorkflowExecution {
    return new WorkflowExecution(
      entity.id,
      entity.workflowName,
      entity.sourceService,
      entity.eventType,
      entity.status,
      entity.requestPayload,
      entity.responsePayload,
      entity.errorMessage,
      entity.triggeredByUserId,
      entity.startedAt,
      entity.finishedAt,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
