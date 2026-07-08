import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

import { AnnouncementCategory } from '../enums/announcement-category.enum';
import { AnnouncementPriority } from '../enums/announcement-priority.enum';

export class CreateAnnouncementDto {
  @ApiProperty({
    example: 'Class suspension',
    description: 'Announcement title',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  title!: string;

  @ApiProperty({
    example: 'Classes are suspended due to maintenance.',
    description: 'Announcement content',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    enum: AnnouncementCategory,
    example: AnnouncementCategory.ACADEMIC,
  })
  @IsEnum(AnnouncementCategory)
  category!: AnnouncementCategory;

  @ApiProperty({
    enum: AnnouncementPriority,
    example: AnnouncementPriority.HIGH,
  })
  @IsEnum(AnnouncementPriority)
  priority!: AnnouncementPriority;

  @ApiProperty({
    example: 'STUDENTS',
    description: 'Target audience for the announcement',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  targetAudience!: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID who created the announcement',
  })
  @IsUUID()
  createdByUserId!: string;
}