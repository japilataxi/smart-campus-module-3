import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class WorkflowMetricsService {
  private readonly executionsTotal = new Counter({
    name: 'workflow_executions_total',
    help: 'Total workflow executions triggered',
    labelNames: ['workflowName', 'status'],
    registers: [register],
  });

  private readonly successTotal = new Counter({
    name: 'workflow_executions_success_total',
    help: 'Total successful workflow executions',
    labelNames: ['workflowName'],
    registers: [register],
  });

  private readonly failedTotal = new Counter({
    name: 'workflow_executions_failed_total',
    help: 'Total failed workflow executions',
    labelNames: ['workflowName'],
    registers: [register],
  });

  private readonly webhookRequestsTotal = new Counter({
    name: 'n8n_webhook_requests_total',
    help: 'Total n8n webhook requests sent',
    labelNames: ['workflowName', 'status'],
    registers: [register],
  });

  private readonly durationSeconds = new Histogram({
    name: 'workflow_execution_duration_seconds',
    help: 'Workflow execution duration in seconds',
    labelNames: ['workflowName'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
    registers: [register],
  });

  recordStarted(workflowName: string) {
    this.executionsTotal.inc({ workflowName, status: 'PENDING' });
  }

  recordSuccess(workflowName: string, durationSeconds: number) {
    this.executionsTotal.inc({ workflowName, status: 'SUCCESS' });
    this.successTotal.inc({ workflowName });
    this.webhookRequestsTotal.inc({ workflowName, status: 'SUCCESS' });
    this.durationSeconds.observe({ workflowName }, durationSeconds);
  }

  recordFailure(workflowName: string, durationSeconds: number) {
    this.executionsTotal.inc({ workflowName, status: 'FAILED' });
    this.failedTotal.inc({ workflowName });
    this.webhookRequestsTotal.inc({ workflowName, status: 'FAILED' });
    this.durationSeconds.observe({ workflowName }, durationSeconds);
  }
}
