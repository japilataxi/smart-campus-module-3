import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TransportScheduleStatus } from '../../domain/transport-status.enum';

export class CreateTransportScheduleDto {
  @ApiProperty({ example: 'route uuid' })
  @IsUUID()
  routeId!: string;

  @ApiPropertyOptional({ example: 'vehicle uuid' })
  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({ example: '2026-06-20T08:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  departureTime!: Date;

  @ApiProperty({ example: '2026-06-20T08:30:00.000Z' })
  @Type(() => Date)
  @IsDate()
  arrivalTime!: Date;

  @ApiPropertyOptional({ enum: TransportScheduleStatus, default: TransportScheduleStatus.SCHEDULED })
  @IsEnum(TransportScheduleStatus)
  @IsOptional()
  status?: TransportScheduleStatus;
}

