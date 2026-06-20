import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TransportVehicleStatus } from '../../domain/transport-status.enum';

export class CreateTransportVehicleDto {
  @ApiProperty({ example: 'BUS-001' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  plate: string;

  @ApiProperty({ example: 40 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ enum: TransportVehicleStatus, default: TransportVehicleStatus.AVAILABLE })
  @IsEnum(TransportVehicleStatus)
  @IsOptional()
  status?: TransportVehicleStatus;

  @ApiPropertyOptional({ example: 'route uuid' })
  @IsUUID()
  @IsOptional()
  currentRouteId?: string;
}

