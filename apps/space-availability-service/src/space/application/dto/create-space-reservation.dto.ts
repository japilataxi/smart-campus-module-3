import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpaceReservationDto {
  @ApiProperty({ example: 'b0c0702f-d62d-4c64-8227-6df50d0716b3' })
  @IsString()
  @IsNotEmpty()
  spaceId: string;

  @ApiProperty({ example: 'user-123', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'Team study session', required: false })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiProperty({ example: '2026-06-23T14:00:00.000Z', required: false })
  @IsOptional()
  @IsISO8601()
  startTime?: string;

  @ApiProperty({ example: '2026-06-23T15:00:00.000Z', required: false })
  @IsOptional()
  @IsISO8601()
  endTime?: string;
}
