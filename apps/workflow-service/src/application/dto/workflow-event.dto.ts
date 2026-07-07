import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class WorkflowEventDto {
  @ApiProperty({ example: 'record-id' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ example: { title: 'Payload title' } })
  @IsObject()
  payload!: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'system' })
  @IsOptional()
  @IsString()
  triggeredByUserId?: string;

  @ApiPropertyOptional({ example: 'event-idempotency-key' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
