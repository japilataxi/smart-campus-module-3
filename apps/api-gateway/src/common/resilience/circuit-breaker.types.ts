export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerConfig {
  timeoutMs: number;
  errorThresholdPercentage: number;
  resetTimeoutMs: number;
  rollingWindowSize: number;
  minimumRequests: number;
}

export interface CircuitBreakerFallbackResponse {
  statusCode: 503;
  message: 'Service temporarily unavailable';
  service: string;
}

export interface CircuitBreakerSnapshot {
  service: string;
  state: CircuitBreakerState;
  failures: number;
  successes: number;
  nextAttemptAt?: Date;
}
