import { Module } from '@nestjs/common';

import { AnnouncementsModule } from '../announcements/announcements.module';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [AnnouncementsModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}