import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class ReservationEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReservationEventsConsumer.name);
  private consumer!: Consumer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'classroom-reservation-consumer',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.consumer = kafka.consumer({
      groupId: 'notification-service-group',
    });

    await this.consumer.connect();

    await this.consumer.subscribe({
      topics: [
        'reservation.created',
        'reservation.approved',
        'reservation.rejected',
        'reservation.cancelled',
      ],
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const value = message.value?.toString();

        this.logger.log(`Kafka event received from ${topic}: ${value}`);
      },
    });

    this.logger.log('Kafka consumer connected');
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}