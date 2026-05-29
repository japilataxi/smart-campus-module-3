import { ApiProperty } from '@nestjs/swagger';

export class QrAccessResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  accessPoint: string;

  @ApiProperty()
  validated: boolean;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty({ nullable: true })
  validatedAt?: Date | null;

  @ApiProperty()
  createdAt: Date;
}

