import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { FilterAnnouncementsDto } from './dto/filter-announcements.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementStatus } from './enums/announcement-status.enum';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = this.announcementsRepository.create(createAnnouncementDto);

    const savedAnnouncement = await this.announcementsRepository.save(announcement);

    await this.kafkaProducerService.emit('AnnouncementCreated', savedAnnouncement);

    return savedAnnouncement;
  }

  async findAll(filters: FilterAnnouncementsDto): Promise<{
    data: Announcement[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const queryBuilder = this.announcementsRepository
      .createQueryBuilder('announcement')
      .orderBy('announcement.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (filters.search) {
      queryBuilder.andWhere(
        '(announcement.title ILIKE :search OR announcement.content ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.category) {
      queryBuilder.andWhere('announcement.category = :category', {
        category: filters.category,
      });
    }

    if (filters.priority) {
      queryBuilder.andWhere('announcement.priority = :priority', {
        priority: filters.priority,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('announcement.status = :status', {
        status: filters.status,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementsRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findOne(id);

    if (announcement.status === AnnouncementStatus.ARCHIVED) {
      throw new BadRequestException('Archived announcements cannot be updated');
    }

    Object.assign(announcement, updateAnnouncementDto);

    const savedAnnouncement = await this.announcementsRepository.save(announcement);

    await this.kafkaProducerService.emit('AnnouncementUpdated', savedAnnouncement);

    return savedAnnouncement;
  }

  async publish(id: string): Promise<Announcement> {
    const announcement = await this.findOne(id);

    if (announcement.status === AnnouncementStatus.PUBLISHED) {
      throw new BadRequestException('Announcement is already published');
    }

    if (announcement.status === AnnouncementStatus.ARCHIVED) {
      throw new BadRequestException('Archived announcements cannot be published');
    }

    announcement.status = AnnouncementStatus.PUBLISHED;
    announcement.publishedAt = new Date();

    const savedAnnouncement = await this.announcementsRepository.save(announcement);

    await this.kafkaProducerService.emit('AnnouncementPublished', savedAnnouncement);

    return savedAnnouncement;
  }

  async archive(id: string): Promise<Announcement> {
    const announcement = await this.findOne(id);

    if (announcement.status === AnnouncementStatus.ARCHIVED) {
      throw new BadRequestException('Announcement is already archived');
    }

    announcement.status = AnnouncementStatus.ARCHIVED;

    const savedAnnouncement = await this.announcementsRepository.save(announcement);

    await this.kafkaProducerService.emit('AnnouncementArchived', savedAnnouncement);

    return savedAnnouncement;
  }

  async remove(id: string): Promise<{ message: string; id: string }> {
    const announcement = await this.findOne(id);

    await this.announcementsRepository.remove(announcement);

    await this.kafkaProducerService.emit('AnnouncementDeleted', {
      id,
      deletedAt: new Date().toISOString(),
    });

    return {
      message: 'Announcement deleted successfully',
      id,
    };
  }
  countAllAnnouncements(): Promise<number> {
  return this.announcementsRepository.count();
}

countPublishedAnnouncements(): Promise<number> {
  return this.announcementsRepository.count({
    where: {
      status: AnnouncementStatus.PUBLISHED,
    },
  });
}
}