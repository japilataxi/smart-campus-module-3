import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Incident } from './incidents/entities/incident.entity';
import { IncidentsModule } from './incidents/incidents.module';

import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://postgres:postgres@localhost:5435/campus_incidents_db',
      entities: [Incident],
      synchronize: true,
    }),

    IncidentsModule,

    HealthModule,
    MetricsModule,
  ],
})
export class AppModule {}