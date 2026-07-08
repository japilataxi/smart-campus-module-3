import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly campusEventsCreatedTotal = new Counter({
    name: 'campus_events_created_total',
    help: 'Total number of campus events created',
  });

  private readonly campusEventsCancelledTotal = new Counter({
    name: 'campus_events_cancelled_total',
    help: 'Total number of campus events cancelled',
  });

  private readonly eventRegistrationsCreatedTotal = new Counter({
    name: 'event_registrations_created_total',
    help: 'Total number of event registrations created',
  });

  private readonly eventKafkaEventsPublishedTotal = new Counter({
    name: 'event_kafka_events_published_total',
    help: 'Total number of Kafka events published by event-service',
  });

  incrementCampusEventsCreated(): void {
    this.campusEventsCreatedTotal.inc();
  }

  incrementCampusEventsCancelled(): void {
    this.campusEventsCancelledTotal.inc();
  }

  incrementEventRegistrationsCreated(): void {
    this.eventRegistrationsCreatedTotal.inc();
  }

  incrementKafkaEventsPublished(): void {
    this.eventKafkaEventsPublishedTotal.inc();
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}