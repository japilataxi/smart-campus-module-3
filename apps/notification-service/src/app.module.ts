import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { NotificationPreference } from './notifications/entities/notification-preference.entity';
import { Notification } from './notifications/entities/notification.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { RedisModule } from './cache/redis.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        'apps/notification-service/.env',
        '.env',
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined');
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [Notification, NotificationPreference],
          synchronize: true,
        };
      },
    }),
    HealthModule,
    MetricsModule,
    NotificationsModule,
    RedisModule,
    RabbitmqModule,
    WebsocketModule,
  ],
})
export class AppModule {}