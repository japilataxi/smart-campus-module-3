import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'Clean Architecture',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: '9780134494166',
  })
  @IsString()
  isbn!: string;

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  totalCopies!: number;

  @ApiProperty({
    example: 'AUTHOR_UUID',
  })
  @IsUUID()
  authorId!: string;

  @ApiProperty({
    example: 'CATEGORY_UUID',
  })
  @IsUUID()
  categoryId!: string;
}