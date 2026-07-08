import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);

  private readonly kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'event-service',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  });

  private readonly producer: Producer = this.kafka.producer();

  async onModuleInit(): Promise<void> {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async emit(eventType: string, payload: unknown): Promise<void> {
    await this.producer.send({
      topic: process.env.KAFKA_TOPIC || 'campus.events',
      messages: [
        {
          key: eventType,
          value: JSON.stringify({
            eventType,
            source: 'event-service',
            occurredAt: new Date().toISOString(),
            payload,
          }),
        },
      ],
    });

    this.logger.log(`Kafka event emitted: ${eventType}`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
    this.logger.log('Kafka producer disconnected');
  }
}