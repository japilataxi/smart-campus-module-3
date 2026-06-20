import { TransportRouteStatus } from './transport-status.enum';

export type TransportRouteModel = {
  id: string;
  name: string;
  description?: string;
  origin: string;
  destination: string;
  status: TransportRouteStatus;
  createdAt: Date;
  updatedAt: Date;
};

