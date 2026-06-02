import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../domain/enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'Administrator Library' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'admin123@uce.edu.ec' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: UserRole.ADMIN,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role!: UserRole;
}