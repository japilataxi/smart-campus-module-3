import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransportRouteDto } from '../../application/dto/create-transport-route.dto';
import { CreateTransportStopDto } from '../../application/dto/create-transport-stop.dto';
import { CreateTransportVehicleDto } from '../../application/dto/create-transport-vehicle.dto';
import { CreateTransportScheduleDto } from '../../application/dto/create-transport-schedule.dto';
import { UpdateTransportRouteDto } from '../../application/dto/update-transport-route.dto';
import { TransportRepositoryPort } from '../../application/ports/transport-repository.port';
import { TransportRouteEntity } from '../entities/transport-route.entity';
import { TransportStopEntity } from '../entities/transport-stop.entity';
import { TransportVehicleEntity } from '../entities/transport-vehicle.entity';
import { TransportScheduleEntity } from '../entities/transport-schedule.entity';

@Injectable()
export class TypeOrmTransportRepository implements TransportRepositoryPort {
  constructor(
    @InjectRepository(TransportRouteEntity)
    private readonly routeRepository: Repository<TransportRouteEntity>,
    @InjectRepository(TransportStopEntity)
    private readonly stopRepository: Repository<TransportStopEntity>,
    @InjectRepository(TransportVehicleEntity)
    private readonly vehicleRepository: Repository<TransportVehicleEntity>,
    @InjectRepository(TransportScheduleEntity)
    private readonly scheduleRepository: Repository<TransportScheduleEntity>,
  ) {}

  async createRoute(data: CreateTransportRouteDto) {
    return this.routeRepository.save(this.routeRepository.create(data));
  }

  async findRoutes() {
    return this.routeRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findRouteById(id: string) {
    return this.routeRepository.findOne({ where: { id } });
  }

  async updateRoute(id: string, data: UpdateTransportRouteDto) {
    await this.routeRepository.update(id, data);
    return this.findRouteById(id);
  }

  async createStop(data: CreateTransportStopDto) {
    return this.stopRepository.save(this.stopRepository.create(data));
  }

  async findStops(routeId?: string) {
    return this.stopRepository.find({ where: routeId ? { routeId } : {}, order: { name: 'ASC' } });
  }

  async createVehicle(data: CreateTransportVehicleDto) {
    return this.vehicleRepository.save(this.vehicleRepository.create(data));
  }

  async findVehicles() {
    return this.vehicleRepository.find({ order: { code: 'ASC' } });
  }

  async createSchedule(data: CreateTransportScheduleDto) {
    return this.scheduleRepository.save(this.scheduleRepository.create(data));
  }

  async findSchedules(routeId?: string) {
    return this.scheduleRepository.find({ where: routeId ? { routeId } : {}, order: { departureTime: 'ASC' } });
  }
}

