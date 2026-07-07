export type TransportStopModel = {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  routeId?: string;
  createdAt: Date;
  updatedAt: Date;
};

