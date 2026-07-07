import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AnnouncementCategory } from '../enums/announcement-category.enum';
import { AnnouncementPriority } from '../enums/announcement-priority.enum';
import { AnnouncementStatus } from '../enums/announcement-status.enum';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 180 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({
    type: 'enum',
    enum: AnnouncementCategory,
  })
  category!: AnnouncementCategory;

  @Column({
    type: 'enum',
    enum: AnnouncementPriority,
    default: AnnouncementPriority.MEDIUM,
  })
  priority!: AnnouncementPriority;

  @Column({
    type: 'enum',
    enum: AnnouncementStatus,
    default: AnnouncementStatus.DRAFT,
  })
  status!: AnnouncementStatus;

  @Column({ length: 120 })
  targetAudience!: string;

  @Column()
  createdByUserId!: string;

  @Column({ nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}