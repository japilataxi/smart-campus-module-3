import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ResilienceModule } from '../common/resilience/resilience.module';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [HttpModule, ResilienceModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
