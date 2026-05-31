
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';

import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { RolesGuard } from './presentation/guards/roles.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { databaseConfig } from './config/database.config';

import { Classroom } from './domain/entities/classroom.entity';
import { Reservation } from './domain/entities/reservation.entity';

import { ClassroomController } from './presentation/controllers/classroom.controller';
import { ReservationController } from './presentation/controllers/reservation.controller';

import { ClassroomService } from './application/use-cases/classroom.service';
import { ReservationService } from './application/use-cases/reservation.service';

import { ReservationGateway } from './infrastructure/websocket/reservation.gateway';
import { ReservationEventsProducer } from './infrastructure/kafka/reservation-events.producer';

import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './presentation/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    TypeOrmModule.forFeature([Classroom, Reservation]),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),   
    PassportModule,
    JwtModule.register({}),
    TerminusModule,
  ],
  controllers: [ClassroomController, ReservationController, HealthController],
  
  providers: [
  ClassroomService,
  ReservationService,
  ReservationEventsProducer,
  ReservationGateway,
  JwtStrategy,
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
],
})
export class AppModule {}