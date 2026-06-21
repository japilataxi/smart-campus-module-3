import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics({ prefix: 'transport_' });

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', register.contentType)
  async getMetrics() {
    return register.metrics();
  }
}

