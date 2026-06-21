import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TransportRouteStatus } from '../../domain/transport-status.enum';

export class CreateTransportRouteDto {
  @ApiProperty({ example: 'Central Campus Loop' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Main internal campus route' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Main Gate' })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({ example: 'Library Building' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiPropertyOptional({ enum: TransportRouteStatus, default: TransportRouteStatus.ACTIVE })
  @IsEnum(TransportRouteStatus)
  @IsOptional()
  status?: TransportRouteStatus;
}

