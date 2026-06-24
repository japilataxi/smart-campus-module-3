import { Module } from '@nestjs/common';

import { NotificationsModule } from '../notifications/notifications.module';
import { WebsocketModule } from '../websocket/websocket.module';

import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [
    NotificationsModule,
    WebsocketModule,
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}