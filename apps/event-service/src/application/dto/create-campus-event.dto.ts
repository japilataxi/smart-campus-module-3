import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { CampusEventCategory } from '../../domain/enums/campus-event-category.enum';

export class CreateCampusEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsEnum(CampusEventCategory)
  category!: CampusEventCategory;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsInt()
  @Min(1)
  capacity!: number;

  @IsUUID()
  createdByUserId!: string;
}