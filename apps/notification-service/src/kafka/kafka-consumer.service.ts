import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';

import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../websocket/notifications.gateway';

type AnnouncementEventPayload = {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  targetAudience: string;
  createdByUserId: string;
  publishedAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type KafkaAnnouncementEvent = {
  eventType: string;
  source: string;
  occurredAt: string;
  payload: AnnouncementEventPayload;
};

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);

  private readonly kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'notification-service',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  });

  private readonly consumer: Consumer = this.kafka.consumer({
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'notification-service-group',
  });

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.consumer.connect();

    await this.consumer.subscribe({
      topic: process.env.KAFKA_ANNOUNCEMENTS_TOPIC || 'campus.announcements',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) {
          return;
        }

        const event = JSON.parse(message.value.toString()) as KafkaAnnouncementEvent;

        if (event.eventType !== 'AnnouncementPublished') {
          this.logger.log(`Kafka event ignored: ${event.eventType}`);
          return;
        }

        const notification = await this.notificationsService.createFromEvent({
          userId: event.payload.createdByUserId,
          title: event.payload.title,
          message: event.payload.content,
          type: 'ANNOUNCEMENT',
          sourceService: event.source,
          eventType: event.eventType,
          payload: {
            announcementId: event.payload.id,
            category: event.payload.category,
            priority: event.payload.priority,
            targetAudience: event.payload.targetAudience,
            publishedAt: event.payload.publishedAt,
          },
        });

        this.notificationsGateway.emitNewNotificationToAll(notification);

        this.logger.log(
          `Announcement notification created from Kafka event: ${event.payload.id}`,
        );
      },
    });

    this.logger.log('Kafka consumer connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
    this.logger.log('Kafka consumer disconnected');
  }
}