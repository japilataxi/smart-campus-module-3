import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

import {
  SpaceAvailabilityStatus,
  SpaceStatus,
  SpaceType,
} from '../../domain/space-status.enum';

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateSpaceDto {
  @ApiProperty({ example: 'Laboratory A-101' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: SpaceType, example: SpaceType.Laboratory })
  @IsEnum(SpaceType)
  type: SpaceType;

  @ApiProperty({ example: 'Building A, Floor 1' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 32 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ enum: SpaceStatus, example: SpaceStatus.Active, required: false })
  @IsOptional()
  @IsEnum(SpaceStatus)
  status?: SpaceStatus;

  @ApiProperty({ enum: SpaceAvailabilityStatus, example: SpaceAvailabilityStatus.Available, required: false })
  @IsOptional()
  @IsEnum(SpaceAvailabilityStatus)
  availabilityStatus?: SpaceAvailabilityStatus;

  @ApiProperty({ example: '07:00' })
  @Matches(timePattern)
  openingTime: string;

  @ApiProperty({ example: '21:00' })
  @Matches(timePattern)
  closingTime: string;
}
