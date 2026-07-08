import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { CircuitBreakerService } from '../common/resilience/circuit-breaker.service';
import { CircuitBreakerFallbackResponse } from '../common/resilience/circuit-breaker.types';

@Injectable()
export class ProxyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  async forwardRequest(params: {
    method: string;
    targetUrl: string;
    body?: unknown;
    authorization?: string;
  }) {
    const serviceName = this.resolveServiceName(params.targetUrl);

    try {
      const response = await this.circuitBreakerService.execute(
        serviceName,
        async () => {
          const downstreamResponse = await firstValueFrom(
            this.httpService.request({
              method: params.method,
              url: params.targetUrl,
              data: params.body,
              timeout: this.getTimeoutMs(),
              headers: {
                ...(params.authorization
                  ? { Authorization: params.authorization }
                  : {}),
              },
            }),
          );

          return downstreamResponse.data;
        },
      );

      if (this.isFallbackResponse(response)) {
        throw new HttpException(response, response.statusCode);
      }

      return response;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      const status = error.response?.status || 500;
      const data = error.response?.data || {
        message: 'Internal gateway error',
      };

      throw new HttpException(data, status);
    }
  }

  private getTimeoutMs(): number {
    const timeout = Number(process.env.CIRCUIT_BREAKER_TIMEOUT_MS ?? 5000);
    return Number.isFinite(timeout) && timeout > 0 ? timeout : 5000;
  }

  private isFallbackResponse(
    response: unknown,
  ): response is CircuitBreakerFallbackResponse {
    const fallback = response as Partial<CircuitBreakerFallbackResponse>;

    return (
      fallback.statusCode === 503 &&
      fallback.message === 'Service temporarily unavailable' &&
      typeof fallback.service === 'string'
    );
  }

  private resolveServiceName(targetUrl: string): string {
    const services = [
      {
        name: 'auth-service',
        url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      },
      {
        name: 'library-service',
        url: process.env.LIBRARY_SERVICE_URL || 'http://localhost:3002',
      },
      {
        name: 'campus-incident-service',
        url: process.env.CAMPUS_INCIDENT_SERVICE_URL || 'http://localhost:3020',
      },
      {
        name: 'notification-service',
        url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3010',
      },
      {
        name: 'qr-access-service',
        url: process.env.QR_ACCESS_SERVICE_URL || 'http://localhost:3021',
      },
      {
        name: 'transport-service',
        url: process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022',
      },
      {
        name: 'space-availability-service',
        url:
          process.env.SPACE_AVAILABILITY_SERVICE_URL ||
          'http://localhost:3023',
      },
      {
        name: 'workflow-service',
        url: process.env.WORKFLOW_SERVICE_URL || 'http://localhost:3024',
      },
      {
        name: 'announcement-service',
        url: process.env.ANNOUNCEMENT_SERVICE_URL || 'http://localhost:3007',
      },
    ];

    const matchedService = services.find((service) =>
      targetUrl.startsWith(service.url),
    );

    if (matchedService) {
      return matchedService.name;
    }

    try {
      return new URL(targetUrl).host;
    } catch {
      return 'unknown-service';
    }
  }
}
