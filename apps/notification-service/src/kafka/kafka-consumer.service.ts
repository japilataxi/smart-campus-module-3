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

type KafkaCampusEvent = {
  eventType: string;
  source: string;
  occurredAt: string;
  payload: any;
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

    await this.consumer.subscribe({
      topic: process.env.KAFKA_EVENTS_TOPIC || 'campus.events',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) {
          return;
        }

        const event = JSON.parse(message.value.toString()) as
          | KafkaAnnouncementEvent
          | KafkaCampusEvent;

        if (event.eventType === 'AnnouncementPublished') {
          const announcementEvent = event as KafkaAnnouncementEvent;

          const notification = await this.notificationsService.createFromEvent({
            userId: announcementEvent.payload.createdByUserId,
            title: announcementEvent.payload.title,
            message: announcementEvent.payload.content,
            type: 'ANNOUNCEMENT',
            sourceService: announcementEvent.source,
            eventType: announcementEvent.eventType,
            payload: {
              announcementId: announcementEvent.payload.id,
              category: announcementEvent.payload.category,
              priority: announcementEvent.payload.priority,
              targetAudience: announcementEvent.payload.targetAudience,
              publishedAt: announcementEvent.payload.publishedAt,
            },
          });

          this.notificationsGateway.emitNewNotificationToAll(notification);

          this.logger.log(
            `Announcement notification created from Kafka event: ${announcementEvent.payload.id}`,
          );

          return;
        }

        if (
          event.eventType === 'CampusEventCreated' ||
          event.eventType === 'CampusEventCancelled' ||
          event.eventType === 'CampusEventRegistrationCreated'
        ) {
          const campusEvent = (event as KafkaCampusEvent).payload.event || event.payload;
          const registration = (event as KafkaCampusEvent).payload.registration;

          const notification = await this.notificationsService.createFromEvent({
            userId:
              campusEvent.createdByUserId ||
              registration?.userId ||
              'system',
            title:
              event.eventType === 'CampusEventCreated'
                ? `Nuevo evento: ${campusEvent.title}`
                : event.eventType === 'CampusEventCancelled'
                  ? `Evento cancelado: ${campusEvent.title}`
                  : `Nueva inscripción: ${campusEvent.title}`,
            message:
              event.eventType === 'CampusEventCreated'
                ? `Se creó un nuevo evento en ${campusEvent.location}.`
                : event.eventType === 'CampusEventCancelled'
                  ? `El evento ${campusEvent.title} fue cancelado.`
                  : `Un estudiante se registró al evento ${campusEvent.title}.`,
            type: 'EVENT',
            sourceService: event.source,
            eventType: event.eventType,
            payload: {
              eventId: campusEvent.id,
              registrationId: registration?.id,
              category: campusEvent.category,
              location: campusEvent.location,
              startDate: campusEvent.startDate,
              endDate: campusEvent.endDate,
            },
          });

          this.notificationsGateway.emitNewNotificationToAll(notification);

          this.logger.log(
            `Event notification created from Kafka event: ${event.eventType}`,
          );

          return;
        }

        this.logger.log(`Kafka event ignored: ${event.eventType}`);
      },
    });

    this.logger.log('Kafka consumer connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
    this.logger.log('Kafka consumer disconnected');
  }
}