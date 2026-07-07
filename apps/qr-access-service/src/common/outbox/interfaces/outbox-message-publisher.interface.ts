import { OutboxEvent } from '../entities/outbox-event.entity';

export const OUTBOX_MESSAGE_PUBLISHER = Symbol('OUTBOX_MESSAGE_PUBLISHER');

export interface OutboxMessagePublisher {
  publish(event: OutboxEvent): Promise<void>;
}
