import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import { RoleEnum } from '../../auth/enums/role.enum';

export class UpdateUserRolesDto {
  @ApiProperty({
    example: ['librarian'],
    enum: RoleEnum,
    isArray: true,
  })
  @IsArray()
  @IsEnum(RoleEnum, { each: true })
  roles!: RoleEnum[];
}