import { Injectable, Logger } from '@nestjs/common';
import { Counter, register } from 'prom-client';

import {
  CIRCUIT_BREAKER_METRIC_NAMES,
  DEFAULT_CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE,
  DEFAULT_CIRCUIT_BREAKER_MINIMUM_REQUESTS,
  DEFAULT_CIRCUIT_BREAKER_RESET_TIMEOUT_MS,
  DEFAULT_CIRCUIT_BREAKER_ROLLING_WINDOW_SIZE,
  DEFAULT_CIRCUIT_BREAKER_TIMEOUT_MS,
} from './circuit-breaker.constants';
import {
  CircuitBreakerConfig,
  CircuitBreakerFallbackResponse,
  CircuitBreakerSnapshot,
  CircuitBreakerState,
} from './circuit-breaker.types';

interface CircuitBreakerRuntimeState {
  state: CircuitBreakerState;
  outcomes: boolean[];
  nextAttemptAt?: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly circuits = new Map<string, CircuitBreakerRuntimeState>();
  private readonly config: CircuitBreakerConfig;
  private readonly openCounter: Counter<string>;
  private readonly fallbackCounter: Counter<string>;
  private readonly downstreamFailureCounter: Counter<string>;

  constructor() {
    this.config = {
      timeoutMs: this.readNumberEnv(
        'CIRCUIT_BREAKER_TIMEOUT_MS',
        DEFAULT_CIRCUIT_BREAKER_TIMEOUT_MS,
      ),
      errorThresholdPercentage: this.readNumberEnv(
        'CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE',
        DEFAULT_CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE,
      ),
      resetTimeoutMs: this.readNumberEnv(
        'CIRCUIT_BREAKER_RESET_TIMEOUT_MS',
        DEFAULT_CIRCUIT_BREAKER_RESET_TIMEOUT_MS,
      ),
      rollingWindowSize: this.readNumberEnv(
        'CIRCUIT_BREAKER_ROLLING_WINDOW_SIZE',
        DEFAULT_CIRCUIT_BREAKER_ROLLING_WINDOW_SIZE,
      ),
      minimumRequests: this.readNumberEnv(
        'CIRCUIT_BREAKER_MINIMUM_REQUESTS',
        DEFAULT_CIRCUIT_BREAKER_MINIMUM_REQUESTS,
      ),
    };

    this.openCounter = this.getOrCreateCounter(
      CIRCUIT_BREAKER_METRIC_NAMES.openTotal,
      'Total number of times a downstream circuit was opened.',
    );
    this.fallbackCounter = this.getOrCreateCounter(
      CIRCUIT_BREAKER_METRIC_NAMES.fallbackTotal,
      'Total number of fallback responses returned by the circuit breaker.',
    );
    this.downstreamFailureCounter = this.getOrCreateCounter(
      CIRCUIT_BREAKER_METRIC_NAMES.downstreamFailuresTotal,
      'Total number of downstream request failures observed by the circuit breaker.',
    );
  }

  async execute<T>(
    serviceName: string,
    operation: () => Promise<T>,
  ): Promise<T | CircuitBreakerFallbackResponse> {
    const circuit = this.getCircuit(serviceName);

    if (circuit.state === CircuitBreakerState.OPEN) {
      if (Date.now() < (circuit.nextAttemptAt ?? 0)) {
        return this.fallback(serviceName);
      }

      circuit.state = CircuitBreakerState.HALF_OPEN;
      this.logger.warn(`Circuit half-open: service=${serviceName}`);
    }

    try {
      const result = await this.withTimeout(operation(), serviceName);
      this.recordSuccess(serviceName, circuit);
      return result;
    } catch (error) {
      if (this.isClientError(error)) {
        throw error;
      }

      this.downstreamFailureCounter.inc({ service: serviceName });
      this.recordFailure(serviceName, circuit, error);
      return this.fallback(serviceName);
    }
  }

  getSnapshot(serviceName: string): CircuitBreakerSnapshot {
    const circuit = this.getCircuit(serviceName);
    const failures = circuit.outcomes.filter((outcome) => !outcome).length;
    const successes = circuit.outcomes.filter(Boolean).length;

    return {
      service: serviceName,
      state: circuit.state,
      failures,
      successes,
      nextAttemptAt: circuit.nextAttemptAt
        ? new Date(circuit.nextAttemptAt)
        : undefined,
    };
  }

  private recordSuccess(
    serviceName: string,
    circuit: CircuitBreakerRuntimeState,
  ): void {
    this.recordOutcome(circuit, true);

    if (circuit.state === CircuitBreakerState.HALF_OPEN) {
      circuit.state = CircuitBreakerState.CLOSED;
      circuit.outcomes = [];
      circuit.nextAttemptAt = undefined;
      this.logger.log(`Circuit closed: service=${serviceName}`);
    }
  }

  private recordFailure(
    serviceName: string,
    circuit: CircuitBreakerRuntimeState,
    error: unknown,
  ): void {
    this.recordOutcome(circuit, false);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    this.logger.warn(`Downstream request failed: service=${serviceName} error=${errorMessage}`);

    if (circuit.state === CircuitBreakerState.HALF_OPEN || this.shouldOpen(circuit)) {
      this.openCircuit(serviceName, circuit);
    }
  }

  private shouldOpen(circuit: CircuitBreakerRuntimeState): boolean {
    if (circuit.outcomes.length < this.config.minimumRequests) {
      return false;
    }

    const failureCount = circuit.outcomes.filter((outcome) => !outcome).length;
    if (failureCount < this.config.minimumRequests) {
      return false;
    }

    const errorPercentage = (failureCount / circuit.outcomes.length) * 100;
    return errorPercentage >= this.config.errorThresholdPercentage;
  }

  private openCircuit(
    serviceName: string,
    circuit: CircuitBreakerRuntimeState,
  ): void {
    if (circuit.state !== CircuitBreakerState.OPEN) {
      this.openCounter.inc({ service: serviceName });
    }

    circuit.state = CircuitBreakerState.OPEN;
    circuit.nextAttemptAt = Date.now() + this.config.resetTimeoutMs;
    this.logger.error(
      `Circuit opened: service=${serviceName} resetTimeoutMs=${this.config.resetTimeoutMs}`,
    );
  }

  private fallback(serviceName: string): CircuitBreakerFallbackResponse {
    this.fallbackCounter.inc({ service: serviceName });
    this.logger.warn(`Circuit fallback returned: service=${serviceName}`);

    return {
      statusCode: 503,
      message: 'Service temporarily unavailable',
      service: serviceName,
    };
  }

  private recordOutcome(
    circuit: CircuitBreakerRuntimeState,
    outcome: boolean,
  ): void {
    circuit.outcomes.push(outcome);

    if (circuit.outcomes.length > this.config.rollingWindowSize) {
      circuit.outcomes.shift();
    }
  }

  private getCircuit(serviceName: string): CircuitBreakerRuntimeState {
    const existingCircuit = this.circuits.get(serviceName);

    if (existingCircuit) {
      return existingCircuit;
    }

    const circuit: CircuitBreakerRuntimeState = {
      state: CircuitBreakerState.CLOSED,
      outcomes: [],
    };

    this.circuits.set(serviceName, circuit);
    return circuit;
  }

  private async withTimeout<T>(promise: Promise<T>, serviceName: string): Promise<T> {
    let timeout: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => {
        reject(new Error(`Circuit breaker timeout after ${this.config.timeoutMs}ms for ${serviceName}`));
      }, this.config.timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }

  private isClientError(error: unknown): boolean {
    const maybeHttpError = error as { response?: { status?: number } };
    const status = maybeHttpError.response?.status;
    return typeof status === 'number' && status >= 400 && status < 500;
  }

  private readNumberEnv(name: string, fallback: number): number {
    const value = Number(process.env[name]);
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  private getOrCreateCounter(name: string, help: string): Counter<string> {
    const existingMetric = register.getSingleMetric(name) as Counter<string> | undefined;

    if (existingMetric) {
      return existingMetric;
    }

    return new Counter({
      name,
      help,
      labelNames: ['service'],
    });
  }
}
