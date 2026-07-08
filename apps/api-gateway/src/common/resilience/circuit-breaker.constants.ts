export const DEFAULT_CIRCUIT_BREAKER_TIMEOUT_MS = 5000;
export const DEFAULT_CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE = 50;
export const DEFAULT_CIRCUIT_BREAKER_RESET_TIMEOUT_MS = 30000;
export const DEFAULT_CIRCUIT_BREAKER_ROLLING_WINDOW_SIZE = 10;
export const DEFAULT_CIRCUIT_BREAKER_MINIMUM_REQUESTS = 2;

export const CIRCUIT_BREAKER_METRIC_NAMES = {
  openTotal: 'circuit_breaker_open_total',
  fallbackTotal: 'circuit_breaker_fallback_total',
  downstreamFailuresTotal: 'downstream_request_failures_total',
} as const;
