import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'firstnamelastname@uce.edu.ec' })
  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@uce\.edu\.ec$/, {
    message: 'Email must be an institutional UCE email address',
  })
  email!: string;

  @ApiProperty({ example: 'Password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}