import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

import { AnnouncementCategory } from '../enums/announcement-category.enum';
import { AnnouncementPriority } from '../enums/announcement-priority.enum';
import { AnnouncementStatus } from '../enums/announcement-status.enum';

export class FilterAnnouncementsDto {
  @ApiPropertyOptional({
    example: 'maintenance',
    description: 'Search by title or content',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: AnnouncementCategory })
  @IsOptional()
  @IsEnum(AnnouncementCategory)
  category?: AnnouncementCategory;

  @ApiPropertyOptional({ enum: AnnouncementPriority })
  @IsOptional()
  @IsEnum(AnnouncementPriority)
  priority?: AnnouncementPriority;

  @ApiPropertyOptional({ enum: AnnouncementStatus })
  @IsOptional()
  @IsEnum(AnnouncementStatus)
  status?: AnnouncementStatus;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  @Max(100)
  limit: number = 10;
}