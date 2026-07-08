import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ListWorkflowExecutionsQueryDto } from '../../application/dto/list-workflow-executions-query.dto';
import { TriggerWorkflowDto } from '../../application/dto/trigger-workflow.dto';
import { WorkflowEventDto } from '../../application/dto/workflow-event.dto';
import { WorkflowService } from '../../application/use-cases/workflow.service';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { Roles } from '../../security/roles.decorator';
import { RolesGuard } from '../../security/roles.guard';

@ApiTags('Workflows')
@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('trigger')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually trigger a workflow. Admin only.' })
  trigger(@Body() dto: TriggerWorkflowDto) {
    return this.workflowService.trigger(dto);
  }

  @Post('incident-created')
  @ApiOperation({ summary: 'Trigger incident-created-workflow from campus-incident-service' })
  incidentCreated(@Body() dto: WorkflowEventDto) {
    return this.workflowService.triggerIncidentCreated(dto);
  }

  @Post('user-registered')
  @ApiOperation({ summary: 'Trigger user-registered-workflow from auth-service' })
  userRegistered(@Body() dto: WorkflowEventDto) {
    return this.workflowService.triggerUserRegistered(dto);
  }

  @Post('library-loan-created')
  @ApiOperation({ summary: 'Trigger library-loan-created-workflow from library-service' })
  libraryLoanCreated(@Body() dto: WorkflowEventDto) {
    return this.workflowService.triggerLibraryLoanCreated(dto);
  }

  @Post('critical-notification')
  @ApiOperation({ summary: 'Trigger critical-notification-workflow from notification-service' })
  criticalNotification(@Body() dto: WorkflowEventDto) {
    return this.workflowService.triggerCriticalNotification(dto);
  }

  @Get('executions')
  @ApiOperation({ summary: 'List workflow execution history' })
  findAll(@Query() query: ListWorkflowExecutionsQueryDto) {
    return this.workflowService.findAll(query.limit || 50);
  }

  @Get('executions/:id')
  @ApiOperation({ summary: 'Get workflow execution by id' })
  findById(@Param('id') id: string) {
    return this.workflowService.findById(id);
  }
}
