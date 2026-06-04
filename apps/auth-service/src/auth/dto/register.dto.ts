import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'first name' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'last name' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

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