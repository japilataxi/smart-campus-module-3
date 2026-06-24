import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RedisCacheService } from '../../../common/cache/redis-cache.service';
import { TransportRouteStatus, TransportScheduleStatus, TransportVehicleStatus } from '../../domain/transport-status.enum';
import { CreateTransportRouteDto } from '../dto/create-transport-route.dto';
import { CreateTransportStopDto } from '../dto/create-transport-stop.dto';
import { CreateTransportVehicleDto } from '../dto/create-transport-vehicle.dto';
import { CreateTransportScheduleDto } from '../dto/create-transport-schedule.dto';
import { UpdateTransportRouteDto } from '../dto/update-transport-route.dto';
import { TRANSPORT_REPOSITORY } from '../ports/transport-repository.port';
import type { TransportRepositoryPort } from '../ports/transport-repository.port';
import { RabbitmqPublisherService } from '../../../rabbitmq/rabbitmq-publisher.service';

@Injectable()
export class TransportService {
  private readonly cacheTtlSeconds = 60;

  constructor(
    @Inject(TRANSPORT_REPOSITORY)
    private readonly repository: TransportRepositoryPort,
    private readonly cache: RedisCacheService,
    private readonly rabbitmqPublisher: RabbitmqPublisherService,
  ) {}

  async createRoute(data: CreateTransportRouteDto) {
    const route = await this.repository.createRoute({ ...data, status: data.status || TransportRouteStatus.ACTIVE });
    await this.cache.del('transport:routes');
    await this.rabbitmqPublisher.publish('transport.route.created', {
    userId: 'admin',
    title: 'Transport route created',
    message: `Transport route ${route.name} was created.`,
    type: 'INFO',
    sourceService: 'transport-service',
    eventType: 'TransportRouteCreated',
    routeId: route.id,
    routeName: route.name,
    status: route.status,
  });
    return route;
  }

  async findRoutes() {
    const cached = await this.cache.get('transport:routes');
    if (cached) return cached;
    const routes = await this.repository.findRoutes();
    await this.cache.set('transport:routes', routes, this.cacheTtlSeconds);
    return routes;
  }

  async findRouteById(id: string) {
    const route = await this.repository.findRouteById(id);
    if (!route) throw new NotFoundException('Transport route not found');
    return route;
  }

  async updateRoute(id: string, data: UpdateTransportRouteDto) {
    const route = await this.repository.updateRoute(id, data);
    if (!route) throw new NotFoundException('Transport route not found');
    await this.cache.del('transport:routes');
    await this.cache.del(`transport:availability:${id}`);

    await this.rabbitmqPublisher.publish('transport.route.updated', {
    userId: 'admin',
    title: 'Transport route updated',
    message: `Transport route ${route.name} was updated.`,
    type: 'INFO',
    sourceService: 'transport-service',
    eventType: 'TransportRouteUpdated',
    routeId: route.id,
    routeName: route.name,
    status: route.status,
  });
    return route;
  }

  async createStop(data: CreateTransportStopDto) {
    const stop = await this.repository.createStop(data);
    await this.cache.del(`transport:stops:${data.routeId || 'all'}`);

    await this.rabbitmqPublisher.publish('transport.stop.created', {
    userId: 'admin',
    title: 'Transport stop created',
    message: `A new transport stop was created.`,
    type: 'INFO',
    sourceService: 'transport-service',
    eventType: 'TransportStopCreated',
    stopId: stop.id,
    routeId: data.routeId,
  });
    return stop;
  }

  async findStops(routeId?: string) {
    const key = `transport:stops:${routeId || 'all'}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const stops = await this.repository.findStops(routeId);
    await this.cache.set(key, stops, this.cacheTtlSeconds);
    return stops;
  }

  async createVehicle(data: CreateTransportVehicleDto) {
  const vehicle = await this.repository.createVehicle({
    ...data,
    status: data.status || TransportVehicleStatus.AVAILABLE,
  });

  await this.rabbitmqPublisher.publish('transport.vehicle.created', {
    userId: 'admin',
    title: 'Transport vehicle created',
    message: `A new transport vehicle was registered.`,
    type: 'INFO',
    sourceService: 'transport-service',
    eventType: 'TransportVehicleCreated',
    vehicleId: vehicle.id,
    status: vehicle.status,
  });

  return vehicle;
}

  async findVehicles() {
    return this.repository.findVehicles();
  }

  async createSchedule(data: CreateTransportScheduleDto) {
    const schedule = await this.repository.createSchedule({ ...data, status: data.status || TransportScheduleStatus.SCHEDULED });
    await this.cache.del(`transport:schedules:${data.routeId}`);
    await this.cache.del(`transport:availability:${data.routeId}`);
    await this.rabbitmqPublisher.publish('transport.schedule.created', {
    userId: 'admin',
    title: 'Transport schedule created',
    message: `A new transport schedule was created.`,
    type: 'INFO',
    sourceService: 'transport-service',
    eventType: 'TransportScheduleCreated',
    scheduleId: schedule.id,
    routeId: data.routeId,
    status: schedule.status,
  });
    return schedule;
  }

  async findSchedules(routeId?: string) {
    const key = `transport:schedules:${routeId || 'all'}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const schedules = await this.repository.findSchedules(routeId);
    await this.cache.set(key, schedules, this.cacheTtlSeconds);
    return schedules;
  }

  async getRouteAvailability(routeId: string) {
    const key = `transport:availability:${routeId}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;

    const route = await this.findRouteById(routeId);
    const schedules = await this.repository.findSchedules(routeId);
    const nextDepartures = schedules.filter((schedule) =>
      [TransportScheduleStatus.SCHEDULED, TransportScheduleStatus.DELAYED].includes(schedule.status),
    );

    const availability = {
      routeId: route.id,
      routeName: route.name,
      available: route.status === TransportRouteStatus.ACTIVE && nextDepartures.length > 0,
      status: route.status,
      nextDepartures: nextDepartures.slice(0, 5),
      message: route.status !== TransportRouteStatus.ACTIVE
        ? 'Route is not active'
        : nextDepartures.length > 0
          ? 'Route has scheduled departures'
          : 'Route has no scheduled departures',
    };

    await this.cache.set(key, availability, this.cacheTtlSeconds);
    return availability;
  }
}


