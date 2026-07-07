import { CreateTransportRouteDto } from '../dto/create-transport-route.dto';
import { CreateTransportStopDto } from '../dto/create-transport-stop.dto';
import { CreateTransportVehicleDto } from '../dto/create-transport-vehicle.dto';
import { CreateTransportScheduleDto } from '../dto/create-transport-schedule.dto';
import { UpdateTransportRouteDto } from '../dto/update-transport-route.dto';
import { TransportRouteModel } from '../../domain/transport-route.model';
import { TransportStopModel } from '../../domain/transport-stop.model';
import { TransportVehicleModel } from '../../domain/transport-vehicle.model';
import { TransportScheduleModel } from '../../domain/transport-schedule.model';

export const TRANSPORT_REPOSITORY = Symbol('TRANSPORT_REPOSITORY');

export interface TransportRepositoryPort {
  createRoute(data: CreateTransportRouteDto): Promise<TransportRouteModel>;
  findRoutes(): Promise<TransportRouteModel[]>;
  findRouteById(id: string): Promise<TransportRouteModel | null>;
  updateRoute(id: string, data: UpdateTransportRouteDto): Promise<TransportRouteModel | null>;
  createStop(data: CreateTransportStopDto): Promise<TransportStopModel>;
  findStops(routeId?: string): Promise<TransportStopModel[]>;
  createVehicle(data: CreateTransportVehicleDto): Promise<TransportVehicleModel>;
  findVehicles(): Promise<TransportVehicleModel[]>;
  createSchedule(data: CreateTransportScheduleDto): Promise<TransportScheduleModel>;
  findSchedules(routeId?: string): Promise<TransportScheduleModel[]>;
}

