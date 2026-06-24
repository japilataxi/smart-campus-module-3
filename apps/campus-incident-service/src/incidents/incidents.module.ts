import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

  @Module({
  imports: [
    TypeOrmModule.forFeature([Incident]),
    RabbitmqModule,
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService],
})
export class IncidentsModule {}