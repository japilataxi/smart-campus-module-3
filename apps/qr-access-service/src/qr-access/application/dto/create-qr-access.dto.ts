import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateQrAccessDto {
  @ApiProperty({ example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  userId!: string;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z' })
  @IsDateString()
  expirationDate!: string;

  @ApiProperty({ example: 'LIBRARY_ENTRY' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  accessType!: string;

  @ApiProperty({ example: 'Main Library' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  location!: string;
}
