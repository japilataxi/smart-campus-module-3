import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkflowService } from './application/use-cases/workflow.service';
import { N8N_WEBHOOK_PORT } from './application/ports/n8n-webhook.port';
import { WorkflowMetricsService } from './application/ports/workflow-metrics.service';
import { WORKFLOW_EXECUTION_REPOSITORY } from './domain/repositories/workflow-execution.repository';
import { WorkflowCacheService } from './infrastructure/cache/workflow-cache.service';
import { WorkflowExecutionEntity } from './infrastructure/database/workflow-execution.entity';
import { TypeOrmWorkflowExecutionRepository } from './infrastructure/database/typeorm-workflow-execution.repository';
import { N8nWebhookAdapter } from './infrastructure/n8n/n8n-webhook.adapter';
import { WorkflowController } from './interfaces/http/workflow.controller';
import { JwtAuthGuard } from './security/jwt-auth.guard';
import { RolesGuard } from './security/roles.guard';
import { LoggingModule } from './common/logging/logging.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowExecutionEntity]), LoggingModule],
  controllers: [WorkflowController],
  providers: [
    WorkflowService,
    WorkflowCacheService,
    WorkflowMetricsService,
    JwtAuthGuard,
    RolesGuard,
    { provide: WORKFLOW_EXECUTION_REPOSITORY, useClass: TypeOrmWorkflowExecutionRepository },
    { provide: N8N_WEBHOOK_PORT, useClass: N8nWebhookAdapter },
  ],
  exports: [WorkflowService],
})
export class WorkflowModule {}
