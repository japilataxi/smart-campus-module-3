# QR Access Service API Gateway Routing

The `api-gateway` is not a business microservice. It must only expose external REST routes and forward requests to `qr-access-service`.

## Environment Variables

```env
QR_ACCESS_SERVICE_URL=http://qr-access-service:3003
```

For local development outside Docker:

```env
QR_ACCESS_SERVICE_URL=http://localhost:3003
```

## Gateway Routes

The gateway should expose the same business contract under its public API prefix and forward requests through REST:

| Gateway route | Method | Target service route |
| --- | --- | --- |
| `/qr-access/generate` | `POST` | `${QR_ACCESS_SERVICE_URL}/qr-access/generate` |
| `/qr-access/validate` | `POST` | `${QR_ACCESS_SERVICE_URL}/qr-access/validate` |
| `/qr-access/:id/revoke` | `PATCH` | `${QR_ACCESS_SERVICE_URL}/qr-access/:id/revoke` |
| `/qr-access/logs` | `GET` | `${QR_ACCESS_SERVICE_URL}/qr-access/logs` |
| `/qr-access/:id` | `GET` | `${QR_ACCESS_SERVICE_URL}/qr-access/:id` |
| `/qr-access/:id` | `DELETE` | `${QR_ACCESS_SERVICE_URL}/qr-access/:id` |

## NestJS Proxy Example

```ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Controller('qr-access')
export class QrAccessProxyController {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.getOrThrow<string>('QR_ACCESS_SERVICE_URL');
  }

  @Post('generate')
  async generate(@Body() body: unknown) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/qr-access/generate`, body),
    );
    return data;
  }

  @Post('validate')
  async validate(@Body() body: unknown) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/qr-access/validate`, body),
    );
    return data;
  }

  @Patch(':id/revoke')
  async revoke(@Param('id') id: string, @Body() body: unknown) {
    const { data } = await firstValueFrom(
      this.httpService.patch(`${this.baseUrl}/qr-access/${id}/revoke`, body),
    );
    return data;
  }

  @Get('logs')
  async findLogs() {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/qr-access/logs`),
    );
    return data;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/qr-access/${id}`),
    );
    return data;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`${this.baseUrl}/qr-access/${id}`),
    );
    return data;
  }
}
```

## Communication Strategy

```text
web-app -> api-gateway -> qr-access-service
```

No Kafka, RabbitMQ, MQTT, gRPC, or WebSocket is required for QR Access v1. Future events such as `QRAccessValidated` or `QRAccessDenied` can be added behind an application port without changing the REST contract.
