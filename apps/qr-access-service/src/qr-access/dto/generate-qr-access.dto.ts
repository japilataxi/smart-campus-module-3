import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class GenerateQrAccessDto {
  @ApiProperty({ example: 'student-001' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'main-library' })
  @IsString()
  @IsNotEmpty()
  accessPoint: string;

  @ApiProperty({ example: 15, minimum: 1, maximum: 1440 })
  @IsInt()
  @Min(1)
  @Max(1440)
  expiresInMinutes: number;
}

