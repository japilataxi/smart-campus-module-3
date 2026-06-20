import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './common/health/health.module';
import { LoggingModule } from './common/logging/logging.module';
import { MetricsModule } from './common/metrics/metrics.module';
import { TransportModule } from './transport/transport.module';
import { TransportRouteEntity } from './transport/infrastructure/entities/transport-route.entity';
import { TransportStopEntity } from './transport/infrastructure/entities/transport-stop.entity';
import { TransportVehicleEntity } from './transport/infrastructure/entities/transport-vehicle.entity';
import { TransportScheduleEntity } from './transport/infrastructure/entities/transport-schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggingModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        process.env.TRANSPORT_DATABASE_URL ||
        'postgresql://transport_user:transport_password@localhost:5438/transport_db',
      entities: [
        TransportRouteEntity,
        TransportStopEntity,
        TransportVehicleEntity,
        TransportScheduleEntity,
      ],
      synchronize: true,
    }),
    TransportModule,
    HealthModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
