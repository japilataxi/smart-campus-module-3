import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrAccessModule } from './qr-access/qr-access.module';
import { HealthModule } from './common/health/health.module';
import { MetricsModule } from './common/metrics/metrics.module';
import { LoggingModule } from './common/logging/logging.module';
import { QrAccessCodeEntity } from './qr-access/infrastructure/entities/qr-access-code.entity';
import { QrAccessLogEntity } from './qr-access/infrastructure/entities/qr-access-log.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggingModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://qr_access_user:qr_access_password@localhost:5437/qr_access_db',
      entities: [QrAccessCodeEntity, QrAccessLogEntity],
      synchronize: true,
    }),
    QrAccessModule,
    HealthModule,
    MetricsModule,
  ],
})
export class AppModule {}
