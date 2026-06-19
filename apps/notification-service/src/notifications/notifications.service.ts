import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { RedisService } from '../cache/redis.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly redisService: RedisService,
  ) {}

  async create(): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: 'test-user',
      title: 'Test Notification',
      message: 'Notification created successfully',
      type: 'INFO',
      sourceService: 'notification-service',
      eventType: 'TEST_EVENT',
      payload: {
        source: 'swagger',
      },
      read: false,
    });
    
    await this.redisService.increment(
  `notification:unread:${notification.userId}`,
  );
    return this.notificationRepository.save(notification);
  }

  findAll(): Promise<Notification[]> {
    return this.notificationRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findUnread(): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: {
        read: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }


  countAllNotifications(): Promise<number> {
    return this.notificationRepository.count();
  }

  countUnreadNotifications(): Promise<number> {
    return this.notificationRepository.count({
      where: {
        read: false,
      },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = true;

    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(): Promise<{ updated: number }> {
    const result = await this.notificationRepository.update(
      { read: false },
      { read: true },
    );

    return {
      updated: result.affected ?? 0,
    };
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationRepository.remove(notification);

    return { deleted: true };
  }

  async createFromEvent(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    sourceService: string;
    eventType: string;
    payload?: Record<string, unknown>;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...data,
      read: false,
    });

    const savedNotification =
      await this.notificationRepository.save(notification);

    await this.redisService.increment(
      `notification:unread:${savedNotification.userId}`,
    );

    return savedNotification;
  }
}