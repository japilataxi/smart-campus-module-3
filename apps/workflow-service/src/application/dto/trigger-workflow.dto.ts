import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { WorkflowName } from '../../domain/enums/workflow-name.enum';

export class TriggerWorkflowDto {
  @ApiProperty({ enum: WorkflowName })
  @IsEnum(WorkflowName)
  workflowName!: WorkflowName;

  @ApiProperty({ example: 'campus-incident-service' })
  @IsString()
  @IsNotEmpty()
  sourceService!: string;

  @ApiProperty({ example: 'IncidentCreated' })
  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @ApiProperty({ example: { id: 'incident-1', title: 'Broken door' } })
  @IsObject()
  requestPayload!: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'admin-user-id' })
  @IsOptional()
  @IsString()
  triggeredByUserId?: string;

  @ApiPropertyOptional({ example: 'incident-created-incident-1' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
