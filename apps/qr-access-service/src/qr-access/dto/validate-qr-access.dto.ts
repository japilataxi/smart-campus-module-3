import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateQrAccessDto {
  @ApiProperty({ example: 'QR-ACCESS-EXAMPLE' })
  @IsString()
  @IsNotEmpty()
  qrCode: string;

  @ApiProperty({ example: 'main-library' })
  @IsString()
  @IsNotEmpty()
  accessPoint: string;
}

