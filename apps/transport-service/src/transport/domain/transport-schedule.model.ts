import { TransportScheduleStatus } from './transport-status.enum';

export type TransportScheduleModel = {
  id: string;
  routeId: string;
  vehicleId?: string;
  departureTime: Date;
  arrivalTime: Date;
  status: TransportScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
};

