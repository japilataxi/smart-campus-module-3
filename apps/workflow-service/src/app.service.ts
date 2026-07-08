import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      service: process.env.SERVICE_NAME || 'workflow-service',
      description: 'Smart Campus workflow automation service integrated with n8n',
      status: 'running',
    };
  }
}
