import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { SpaceAvailabilityStatus } from '../../domain/space-status.enum';

export class UpdateSpaceAvailabilityDto {
  @ApiProperty({ enum: SpaceAvailabilityStatus, example: SpaceAvailabilityStatus.Available })
  @IsEnum(SpaceAvailabilityStatus)
  availabilityStatus: SpaceAvailabilityStatus;
}
