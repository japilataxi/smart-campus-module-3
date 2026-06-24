import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ValidateQrAccessDto {
  @ApiProperty({ example: 'QR-8b3c6b1f0f2e' })
  @IsString()
  @IsNotEmpty()
  qrCode!: string;

  @ApiProperty({ example: 'Main Library', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(120)
  location?: string;
}
