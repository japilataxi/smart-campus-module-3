import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HealthModule } from './common/health/health.module';
import { LoggingModule } from './common/logging/logging.module';
import { MetricsModule } from './common/metrics/metrics.module';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { createTypeOrmOptions } from './config/typeorm.config';
import { QrAccessModule } from './qr-access/qr-access.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: createTypeOrmOptions,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: jwtConfig,
    }),
    LoggingModule,
    HealthModule,
    MetricsModule,
    QrAccessModule,
  ],
})
export class AppModule {}

