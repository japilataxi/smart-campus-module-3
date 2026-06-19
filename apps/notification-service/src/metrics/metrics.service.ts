import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MetricsService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async getMetrics(): Promise<string> {
    const totalNotifications =
      await this.notificationsService.countAllNotifications();

    const unreadNotifications =
      await this.notificationsService.countUnreadNotifications();

    return [
      '# HELP notification_service_status Notification service status',
      '# TYPE notification_service_status gauge',
      'notification_service_status 1',
      '',
      '# HELP notification_service_notifications_created_total Total notifications created',
      '# TYPE notification_service_notifications_created_total counter',
      `notification_service_notifications_created_total ${totalNotifications}`,
      '',
      '# HELP notification_service_unread_notifications_total Total unread notifications',
      '# TYPE notification_service_unread_notifications_total gauge',
      `notification_service_unread_notifications_total ${unreadNotifications}`,
      '',
      '# HELP notification_service_rabbitmq_messages_consumed_total Total RabbitMQ messages consumed',
      '# TYPE notification_service_rabbitmq_messages_consumed_total counter',
      `notification_service_rabbitmq_messages_consumed_total ${totalNotifications}`,
      '',
      '# HELP notification_service_websocket_connected_clients Connected WebSocket clients',
      '# TYPE notification_service_websocket_connected_clients gauge',
      'notification_service_websocket_connected_clients 0',
    ].join('\n');
  }
}