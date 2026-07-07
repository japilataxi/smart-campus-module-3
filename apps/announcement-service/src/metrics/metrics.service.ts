import { Injectable } from '@nestjs/common';

import { AnnouncementsService } from '../announcements/announcements.service';

@Injectable()
export class MetricsService {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  async getMetrics(): Promise<string> {
    const totalAnnouncements =
      await this.announcementsService.countAllAnnouncements();

    const publishedAnnouncements =
      await this.announcementsService.countPublishedAnnouncements();

    return [
      '# HELP announcement_service_status Announcement service status',
      '# TYPE announcement_service_status gauge',
      'announcement_service_status 1',
      '',
      '# HELP announcement_service_announcements_created_total Total announcements created',
      '# TYPE announcement_service_announcements_created_total counter',
      `announcement_service_announcements_created_total ${totalAnnouncements}`,
      '',
      '# HELP announcement_service_announcements_published_total Total announcements published',
      '# TYPE announcement_service_announcements_published_total gauge',
      `announcement_service_announcements_published_total ${publishedAnnouncements}`,
      '',
      '# HELP announcement_service_kafka_events_total Total Kafka announcement events',
      '# TYPE announcement_service_kafka_events_total counter',
      `announcement_service_kafka_events_total ${totalAnnouncements}`,
    ].join('\n');
  }
}