import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RevokeQrAccessDto {
  @ApiPropertyOptional({ example: 'QR code was manually revoked by campus security.' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  reason?: string;
}
