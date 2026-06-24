import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqPublisherService {
  private readonly logger = new Logger(RabbitmqPublisherService.name);

  private readonly exchange =
    process.env.RABBITMQ_EXCHANGE || 'smart-campus.events';

  async publish(routingKey: string, payload: Record<string, unknown>) {
    const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

    try {
      const connection = await amqp.connect(url);
      const channel = await connection.createChannel();

      await channel.assertExchange(this.exchange, 'topic', {
        durable: true,
      });

      channel.publish(
        this.exchange,
        routingKey,
        Buffer.from(JSON.stringify(payload)),
        {
          persistent: true,
          contentType: 'application/json',
        },
      );

      this.logger.log(`RabbitMQ event published: ${routingKey}`);

      await channel.close();
      await connection.close();
    } catch (error) {
      this.logger.error(
        `Failed to publish RabbitMQ event: ${routingKey}`,
        error,
      );
    }
  }
}