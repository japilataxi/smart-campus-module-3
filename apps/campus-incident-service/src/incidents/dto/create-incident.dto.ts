import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIncidentDto {
  @ApiProperty({
    example: 'Automatic RabbitMQ Incident',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Testing incident producer',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: 'Lab 1',
  })
  @IsString()
  @IsNotEmpty()
  location!: string;
}