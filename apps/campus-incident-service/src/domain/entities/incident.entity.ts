import { IncidentPriority } from '../enums/incident-priority.enum';
import { IncidentStatus } from '../enums/incident-status.enum';

export class Incident {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  reportedBy: string;
  createdAt: Date;
  updatedAt: Date;
}