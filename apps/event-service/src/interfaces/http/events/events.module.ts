import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsService } from '../../../application/use-cases/events.service';
import { AuthModule } from '../../../common/auth/auth.module';
import { CampusEvent } from '../../../domain/entities/campus-event.entity';
import { EventRegistration } from '../../../domain/entities/event-registration.entity';
import { KafkaModule } from '../../../infrastructure/kafka/kafka.module';
import { MetricsModule } from '../../../metrics/metrics.module';
import { EventsController } from './events.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampusEvent, EventRegistration]),
    KafkaModule,
    MetricsModule,
    AuthModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}