import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../websocket/notifications.gateway';

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private readonly logger = new Logger(RabbitmqService.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  private readonly exchange =
    process.env.RABBITMQ_EXCHANGE || 'smart-campus.events';

  private readonly queues = [
    {
      queue: 'notifications.user.registered',
      routingKey: 'user.registered',
    },
    {
      queue: 'notifications.library.loan.created',
      routingKey: 'library.loan.created',
    },
    {
      queue: 'notifications.library.book.reserved',
      routingKey: 'library.book.reserved',
    },
    {
      queue: 'notifications.incident.created',
      routingKey: 'incident.created',
    },
    {
      queue: 'notifications.incident.status.updated',
      routingKey: 'incident.status.updated',
    },

    {
      queue: 'notifications.library.loan.returned',
      routingKey: 'library.loan.returned',
    },
  ];

  // =========================
  // INIT
  // =========================
  async onModuleInit() {
    await this.connectWithRetry();
  }

  // =========================
  // RETRY LOGIC
  // =========================
  private async connectWithRetry() {
    while (true) {
      try {
        await this.connect();
        break; // si conecta, sale del loop
      } catch (error) {
        this.logger.warn(
          'RabbitMQ unavailable, retrying in 5 seconds...',
        );

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  // =========================
  // MAIN CONNECTION LOGIC
  // =========================
  private async connect() {
    const url =
      process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    await channel.assertExchange(this.exchange, 'topic', {
      durable: true,
    });

    for (const item of this.queues) {
      await channel.assertQueue(item.queue, {
        durable: true,
      });

      await channel.bindQueue(item.queue, this.exchange, item.routingKey);

      await channel.consume(
        item.queue,
        async (message) => {
          if (!message) return;

          try {
            const content = JSON.parse(message.content.toString());

            this.logger.log(
              `RabbitMQ event received: ${item.routingKey} ${JSON.stringify(
                content,
              )}`,
            );

            const notification =
              await this.notificationsService.createFromEvent({
                userId: content.userId || 'admin',
                title: content.title || this.buildTitle(item.routingKey),
                message:
                  content.message || this.buildMessage(item.routingKey),
                type: content.type || 'INFO',
                sourceService:
                  content.sourceService ||
                  this.getSourceService(item.routingKey),
                eventType: content.eventType || item.routingKey,
                payload: content,
              });

            this.notificationsGateway.emitNewNotification(
              notification.userId,
              notification,
            );

            this.notificationsGateway.emitNewNotificationToAll(notification);

            channel.ack(message);
          } catch (error) {
            this.logger.error(
              `Failed to process RabbitMQ message from ${item.queue}`,
              error,
            );

            channel.nack(message, false, false);
          }
        },
        {
          noAck: false,
        },
      );
    }

    this.logger.log(`RabbitMQ connected to exchange ${this.exchange}`);
  }

  // =========================
  // HELPERS
  // =========================
  private buildTitle(routingKey: string): string {
    const titles: Record<string, string> = {
      'user.registered': 'New user registered',
      'library.loan.created': 'New library loan created',
      'library.book.reserved': 'Book reserved',
      'incident.created': 'New campus incident created',
      'incident.status.updated': 'Campus incident status updated',
      'library.loan.returned': 'Library loan returned',
    };

    return titles[routingKey] || 'New notification';
  }

  private buildMessage(routingKey: string): string {
    const messages: Record<string, string> = {
      'user.registered': 'A new user has been registered in Smart Campus.',
      'library.loan.created': 'A new library loan has been created.',
      'library.book.reserved': 'A book reservation has been created.',
      'incident.created': 'A new campus incident has been reported.',
      'incident.status.updated': 'A campus incident status was updated.',
      'library.loan.returned': 'A library loan was returned.',
    };

    return messages[routingKey] || 'A new event was received.';
  }

  private getSourceService(routingKey: string): string {
    if (routingKey.startsWith('user.')) return 'auth-service';
    if (routingKey.startsWith('library.')) return 'library-service';
    if (routingKey.startsWith('incident.'))
      return 'campus-incident-service';

    return 'unknown-service';
  }
}