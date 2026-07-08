import { CircuitBreakerService } from './circuit-breaker.service';
import { CircuitBreakerState } from './circuit-breaker.types';

describe('CircuitBreakerService', () => {
  beforeEach(() => {
    process.env.CIRCUIT_BREAKER_TIMEOUT_MS = '20';
    process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE = '50';
    process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_MS = '30000';
    process.env.CIRCUIT_BREAKER_MINIMUM_REQUESTS = '2';
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    delete process.env.CIRCUIT_BREAKER_TIMEOUT_MS;
    delete process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE;
    delete process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_MS;
    delete process.env.CIRCUIT_BREAKER_MINIMUM_REQUESTS;
    jest.restoreAllMocks();
  });

  it('returns successful downstream data normally', async () => {
    const service = new CircuitBreakerService();

    await expect(
      service.execute('library-service', async () => ({ ok: true })),
    ).resolves.toEqual({ ok: true });
  });

  it('returns fallback when a downstream call fails', async () => {
    const service = new CircuitBreakerService();

    await expect(
      service.execute('library-service', async () => {
        throw new Error('connection refused');
      }),
    ).resolves.toEqual({
      statusCode: 503,
      message: 'Service temporarily unavailable',
      service: 'library-service',
    });
  });

  it('returns fallback when a downstream call times out', async () => {
    const service = new CircuitBreakerService();

    await expect(
      service.execute(
        'library-service',
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 100)),
      ),
    ).resolves.toEqual({
      statusCode: 503,
      message: 'Service temporarily unavailable',
      service: 'library-service',
    });
  });

  it('opens the circuit after repeated failures', async () => {
    const service = new CircuitBreakerService();

    await service.execute('library-service', async () => {
      throw new Error('first failure');
    });
    await service.execute('library-service', async () => {
      throw new Error('second failure');
    });

    expect(service.getSnapshot('library-service').state).toBe(CircuitBreakerState.OPEN);
  });

  it('does not call downstream while the circuit is open', async () => {
    const service = new CircuitBreakerService();

    await service.execute('library-service', async () => {
      throw new Error('first failure');
    });
    await service.execute('library-service', async () => {
      throw new Error('second failure');
    });

    const downstreamCall = jest.fn(async () => ({ ok: true }));

    await expect(service.execute('library-service', downstreamCall)).resolves.toEqual({
      statusCode: 503,
      message: 'Service temporarily unavailable',
      service: 'library-service',
    });
    expect(downstreamCall).not.toHaveBeenCalled();
  });
});
