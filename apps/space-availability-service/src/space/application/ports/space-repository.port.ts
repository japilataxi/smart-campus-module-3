import { Space } from '../../domain/space.model';
import {
  SpaceAvailabilityStatus,
  SpaceStatus,
  SpaceType,
} from '../../domain/space-status.enum';

export const SPACE_REPOSITORY = Symbol('SPACE_REPOSITORY');

export type SpaceFilters = {
  type?: SpaceType;
  availabilityStatus?: SpaceAvailabilityStatus;
  location?: string;
};

export interface SpaceRepositoryPort {
  create(space: Partial<Space>): Promise<Space>;
  findAll(filters?: SpaceFilters): Promise<Space[]>;
  findById(id: string): Promise<Space | null>;
  update(id: string, space: Partial<Space>): Promise<Space | null>;
  updateAvailability(id: string, availabilityStatus: SpaceAvailabilityStatus): Promise<Space | null>;
  updateStatus(id: string, status: SpaceStatus): Promise<Space | null>;
  delete(id: string): Promise<boolean>;
}
