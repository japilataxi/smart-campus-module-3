import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

import { AnnouncementCategory } from '../enums/announcement-category.enum';
import { AnnouncementPriority } from '../enums/announcement-priority.enum';

export class UpdateAnnouncementDto {
  @ApiPropertyOptional({ example: 'Updated announcement title' })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated announcement content.' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ enum: AnnouncementCategory })
  @IsOptional()
  @IsEnum(AnnouncementCategory)
  category?: AnnouncementCategory;

  @ApiPropertyOptional({ enum: AnnouncementPriority })
  @IsOptional()
  @IsEnum(AnnouncementPriority)
  priority?: AnnouncementPriority;

  @ApiPropertyOptional({ example: 'STUDENTS' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  targetAudience?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  createdByUserId?: string;
}