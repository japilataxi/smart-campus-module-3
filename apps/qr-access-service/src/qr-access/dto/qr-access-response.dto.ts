import { ApiProperty } from '@nestjs/swagger';
import { QrAccessStatus } from '../enums/qr-access-status.enum';

export class QrAccessResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  accessPoint: string;

  @ApiProperty({ enum: QrAccessStatus })
  status: QrAccessStatus;

  @ApiProperty()
  attemptsCount: number;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty({ nullable: true })
  validatedAt?: Date | null;

  @ApiProperty({ nullable: true })
  lastAttemptAt?: Date | null;

  @ApiProperty({ nullable: true })
  lastDenialReason?: string | null;

  @ApiProperty()
  createdAt: Date;
}

