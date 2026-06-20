import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheService } from '../common/cache/redis-cache.service';
import { TRANSPORT_REPOSITORY } from './application/ports/transport-repository.port';
import { TransportService } from './application/use-cases/transport.service';
import { TransportRouteEntity } from './infrastructure/entities/transport-route.entity';
import { TransportStopEntity } from './infrastructure/entities/transport-stop.entity';
import { TransportVehicleEntity } from './infrastructure/entities/transport-vehicle.entity';
import { TransportScheduleEntity } from './infrastructure/entities/transport-schedule.entity';
import { TypeOrmTransportRepository } from './infrastructure/repositories/typeorm-transport.repository';
import { TransportController } from './interfaces/http/transport.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransportRouteEntity,
      TransportStopEntity,
      TransportVehicleEntity,
      TransportScheduleEntity,
    ]),
  ],
  controllers: [TransportController],
  providers: [
    TransportService,
    RedisCacheService,
    { provide: TRANSPORT_REPOSITORY, useClass: TypeOrmTransportRepository },
  ],
})
export class TransportModule {}

