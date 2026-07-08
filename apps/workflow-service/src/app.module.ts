import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './common/health/health.module';
import { LoggingModule } from './common/logging/logging.module';
import { MetricsModule } from './common/metrics/metrics.module';
import { WorkflowModule } from './workflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET || 'change_me' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.WORKFLOW_DATABASE_URL || process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    LoggingModule,
    HealthModule,
    MetricsModule,
    WorkflowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
