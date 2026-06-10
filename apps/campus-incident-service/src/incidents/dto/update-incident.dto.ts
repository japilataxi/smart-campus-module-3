import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { CreateIncidentDto } from './create-incident.dto';

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
  @ApiPropertyOptional({
    example: 'RESOLVED',
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['OPEN', 'IN_PROGRESS', 'RESOLVED'])
  status?: string;
}