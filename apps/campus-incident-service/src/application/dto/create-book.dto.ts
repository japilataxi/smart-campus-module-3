import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Architecture' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Robert C. Martin' })
  @IsString()
  @IsNotEmpty()
  author!: string;

  @ApiProperty({ example: '9780134494166' })
  @IsString()
  @IsNotEmpty()
  isbn!: string;

  @ApiProperty({ example: 'Software Architecture' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  totalCopies!: number;
}