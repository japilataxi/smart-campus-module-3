import { IsNotEmpty, IsString } from 'class-validator';

export class LoanBookDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string;
}