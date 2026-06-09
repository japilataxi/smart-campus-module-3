import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  @ApiExcludeEndpoint()
  getMetrics(): string {
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    return [
      '# HELP smart_campus_qr_access_service_up Service availability indicator',
      '# TYPE smart_campus_qr_access_service_up gauge',
      'smart_campus_qr_access_service_up 1',
      '# HELP smart_campus_qr_access_service_uptime_seconds Node.js process uptime',
      '# TYPE smart_campus_qr_access_service_uptime_seconds gauge',
      `smart_campus_qr_access_service_uptime_seconds ${uptime}`,
      '# HELP smart_campus_qr_access_service_memory_heap_used_bytes Node.js heap used',
      '# TYPE smart_campus_qr_access_service_memory_heap_used_bytes gauge',
      `smart_campus_qr_access_service_memory_heap_used_bytes ${memory.heapUsed}`,
    ].join('\n');
  }
}
