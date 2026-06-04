import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsUUID,
} from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({
    example: 'student@uce.edu.ec',
  })
  @IsEmail()
  userEmail!: string;

  @ApiProperty({
    example: 'BOOK_UUID',
  })
  @IsUUID()
  bookId!: string;
}