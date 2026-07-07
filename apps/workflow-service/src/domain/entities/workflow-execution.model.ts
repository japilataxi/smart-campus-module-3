import { WorkflowStatus } from '../enums/workflow-status.enum';

export class WorkflowExecution {
  constructor(
    public readonly id: string,
    public readonly workflowName: string,
    public readonly sourceService: string,
    public readonly eventType: string,
    public readonly status: WorkflowStatus,
    public readonly requestPayload: Record<string, unknown>,
    public readonly responsePayload?: Record<string, unknown> | null,
    public readonly errorMessage?: string | null,
    public readonly triggeredByUserId?: string | null,
    public readonly startedAt?: Date | null,
    public readonly finishedAt?: Date | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
