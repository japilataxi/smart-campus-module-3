import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoanBookDto {
  @ApiProperty({ example: 'student-001' })
  @IsString()
  @IsNotEmpty()
  studentId!: string;
}