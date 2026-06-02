import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Check library-service health status' })
  @Get()
  check() {
    return {
      service: 'library-service',
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}