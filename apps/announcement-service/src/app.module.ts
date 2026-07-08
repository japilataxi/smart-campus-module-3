import { MetricsModule } from './metrics/metrics.module';
import { HealthModule } from './health/health.module';
import { KafkaModule } from './kafka/kafka.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnnouncementsModule } from './announcements/announcements.module';
import { Announcement } from './announcements/entities/announcement.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    KafkaModule,
    HealthModule,
    MetricsModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
     url:
       process.env.DATABASE_URL ||
       'postgresql://announcement_user:announcement_password@localhost:5440/announcement_db',
      entities: [Announcement],
      synchronize: true,
    }),

    AnnouncementsModule,
  ],
})
export class AppModule {}