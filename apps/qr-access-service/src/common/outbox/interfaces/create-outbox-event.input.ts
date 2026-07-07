export interface CreateOutboxEventInput {
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  payload: Record<string, unknown>;
  maxRetries?: number;
}
