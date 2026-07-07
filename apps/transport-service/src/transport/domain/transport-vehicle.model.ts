import { TransportVehicleStatus } from './transport-status.enum';

export type TransportVehicleModel = {
  id: string;
  code: string;
  plate: string;
  capacity: number;
  status: TransportVehicleStatus;
  currentRouteId?: string;
  createdAt: Date;
  updatedAt: Date;
};

