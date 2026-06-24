import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqPublisherService.name);
  private connection?: any;
  private channel?: any;

  private readonly exchange =
    process.env.RABBITMQ_EXCHANGE || 'smart-campus.events';

  async onModuleInit() {
    try {
      const url =
        process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(this.exchange, 'topic', {
        durable: true,
      });

      this.logger.log(`RabbitMQ publisher connected to exchange ${this.exchange}`);
    } catch (error) {
      this.logger.error('RabbitMQ publisher connection failed', error);
    }
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }

  async publish(routingKey: string, payload: Record<string, unknown>) {
    if (!this.channel) {
      await this.onModuleInit();
    }

    if (!this.channel) {
      this.logger.warn(`RabbitMQ channel not ready. Event skipped: ${routingKey}`);
      return;
    }

    this.channel.publish(
      this.exchange,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
        contentType: 'application/json',
      },
    );

    this.logger.log(`RabbitMQ event published: ${routingKey}`);
  }
}