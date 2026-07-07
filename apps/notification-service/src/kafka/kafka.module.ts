import { Module } from '@nestjs/common';

import { NotificationsModule } from '../notifications/notifications.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { KafkaConsumerService } from './kafka-consumer.service';

@Module({
  imports: [NotificationsModule, WebsocketModule],
  providers: [KafkaConsumerService],
  exports: [KafkaConsumerService],
})
export class KafkaModule {}