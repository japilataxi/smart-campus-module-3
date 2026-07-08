import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampusEvent } from './domain/entities/campus-event.entity';
import { EventRegistration } from './domain/entities/event-registration.entity';
import { EventsModule } from './interfaces/http/events/events.module';
import { AppCacheModule } from './infrastructure/cache/cache.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/event-service/.env',
    }),

    AppCacheModule,

   TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST') || 'event-db',
    port: Number(configService.get<string>('DB_PORT')) || 5432,
    username: configService.get<string>('DB_USERNAME') || 'event_user',
    password: configService.get<string>('DB_PASSWORD') || 'event_password',
    database: configService.get<string>('DB_DATABASE') || 'event_db',
    entities: [CampusEvent, EventRegistration],
    synchronize: true,
    autoLoadEntities: true,
  }),
}),

    HealthModule,
    MetricsModule,
    EventsModule,
  ],
})
export class AppModule {}