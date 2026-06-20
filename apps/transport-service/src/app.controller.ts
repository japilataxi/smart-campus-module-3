import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Application')
@Controller()
export class AppController {
  @Get()
  root() {
    return {
      service: process.env.SERVICE_NAME || 'transport-service',
      status: 'running',
    };
  }
}

