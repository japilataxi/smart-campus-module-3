import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTransportStopDto {
  @ApiProperty({ example: 'Library Stop' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'North side of the library' })
  @IsString()
  location!: string;

  @ApiPropertyOptional({ example: -0.180653 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: -78.467834 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ example: 'route uuid' })
  @IsUUID()
  @IsOptional()
  routeId?: string;
}

