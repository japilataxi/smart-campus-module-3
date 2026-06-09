import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    example: 'Gabriel García Márquez',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Colombian novelist and Nobel Prize winner',
    required: false,
  })
  @IsOptional()
  @IsString()
  biography?: string;
}