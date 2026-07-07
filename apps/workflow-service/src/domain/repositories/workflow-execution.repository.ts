import { WorkflowStatus } from '../enums/workflow-status.enum';
import { WorkflowExecution } from '../entities/workflow-execution.model';

export type CreateWorkflowExecutionInput = {
  workflowName: string;
  sourceService: string;
  eventType: string;
  status: WorkflowStatus;
  requestPayload: Record<string, unknown>;
  triggeredByUserId?: string | null;
  startedAt?: Date | null;
};

export type UpdateWorkflowExecutionInput = {
  status?: WorkflowStatus;
  responsePayload?: Record<string, unknown> | null;
  errorMessage?: string | null;
  finishedAt?: Date | null;
};

export const WORKFLOW_EXECUTION_REPOSITORY = Symbol('WORKFLOW_EXECUTION_REPOSITORY');

export interface WorkflowExecutionRepositoryPort {
  create(input: CreateWorkflowExecutionInput): Promise<WorkflowExecution>;
  findAll(limit?: number): Promise<WorkflowExecution[]>;
  findById(id: string): Promise<WorkflowExecution | null>;
  update(id: string, input: UpdateWorkflowExecutionInput): Promise<WorkflowExecution | null>;
}
