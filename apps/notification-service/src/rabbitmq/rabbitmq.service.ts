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

  // =========================
  // QR ACCESS EVENTS
  // =========================
  {
    queue: 'notifications.qr.access.generated',
    routingKey: 'qr.access.generated',
  },
  {
    queue: 'notifications.qr.access.granted',
    routingKey: 'qr.access.granted',
  },
  {
    queue: 'notifications.qr.access.denied',
    routingKey: 'qr.access.denied',
  },
  {
    queue: 'notifications.qr.access.revoked',
    routingKey: 'qr.access.revoked',
  },
  // =========================
  // transport ACCESS EVENTS
  // =========================
  {
  queue: 'notifications.transport.route.created',
  routingKey: 'transport.route.created',
  },
  {
    queue: 'notifications.transport.route.updated',
    routingKey: 'transport.route.updated',
  },
  {
    queue: 'notifications.transport.stop.created',
    routingKey: 'transport.stop.created',
  },
  {
    queue: 'notifications.transport.vehicle.created',
    routingKey: 'transport.vehicle.created',
  },
  {
    queue: 'notifications.transport.schedule.created',
    routingKey: 'transport.schedule.created',
  },
  // =========================
  // space availibility ACCESS EVENTS
  // =========================
  {
  queue: 'notifications.space.created',
  routingKey: 'space.created',
  },
  {
    queue: 'notifications.space.updated',
    routingKey: 'space.updated',
  },
  {
    queue: 'notifications.space.deactivated',
    routingKey: 'space.deactivated',
  },
  {
    queue: 'notifications.space.availability.updated',
    routingKey: 'space.availability.updated',
  },
  {
    queue: 'notifications.space.reservation.created',
    routingKey: 'space.reservation.created',
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
      'qr.access.generated': 'QR access generated',
      'qr.access.granted': 'QR access granted',
      'qr.access.denied': 'QR access denied',
      'qr.access.revoked': 'QR access revoked',
      'transport.route.created': 'Transport route created',
      'transport.route.updated': 'Transport route updated',
      'transport.stop.created': 'Transport stop created',
      'transport.vehicle.created': 'Transport vehicle created',
      'transport.schedule.created': 'Transport schedule created',
      'space.created': 'Space created',
      'space.updated': 'Space updated',
      'space.deactivated': 'Space deactivated',
      'space.availability.updated': 'Space availability updated',
      'space.reservation.created': 'Space reservation created',
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
      'qr.access.generated': 'A new QR access code was generated.',
      'qr.access.granted': 'QR access was granted.',
      'qr.access.denied': 'QR access was denied.',
      'qr.access.revoked': 'QR access code was revoked.',
      'transport.route.created': 'A new transport route has been created.',
      'transport.route.updated': 'The transport route has been updated.',
      'transport.stop.created': 'A new stop has been added to the transport route.',
      'transport.vehicle.created': 'A new transport vehicle has been registered in the system.',
      'transport.schedule.created': 'A new transport schedule has been created for a route.',
      'space.created': 'A new campus space was created.',
      'space.updated': 'A campus space was updated.',
      'space.deactivated': 'A campus space was deactivated.',
      'space.availability.updated': 'A campus space availability status changed.',
      'space.reservation.created': 'A new space reservation was created.',
    };

    return messages[routingKey] || 'A new event was received.';
  }

  private getSourceService(routingKey: string): string {
    if (routingKey.startsWith('user.')) return 'auth-service';
    if (routingKey.startsWith('library.')) return 'library-service';
    if (routingKey.startsWith('incident.')) return 'campus-incident-service';
    if (routingKey.startsWith('qr.')) return 'qr-access-service';
    if (routingKey.startsWith('transport.')) return 'transport-service';
    if (routingKey.startsWith('space.')) return 'space-availability-service';
    return 'unknown-service';
  }
}