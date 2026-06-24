import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { RedisCacheService } from '../../../common/cache/redis-cache.service';
import { StructuredLogger } from '../../../common/logging/structured-logger.service';
import { CreateSpaceDto } from '../dto/create-space.dto';
import { CreateSpaceReservationDto } from '../dto/create-space-reservation.dto';
import { UpdateSpaceAvailabilityDto } from '../dto/update-space-availability.dto';
import { UpdateSpaceDto } from '../dto/update-space.dto';
import { SPACE_REPOSITORY, SpaceFilters } from '../ports/space-repository.port';
import type { SpaceRepositoryPort } from '../ports/space-repository.port';
import { Space } from '../../domain/space.model';
import {
  SpaceAvailabilityStatus,
  SpaceStatus,
  SpaceType,
} from '../../domain/space-status.enum';
import { RabbitmqPublisherService } from '../../../rabbitmq/rabbitmq-publisher.service';

@Injectable()
export class SpaceService {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly repository: SpaceRepositoryPort,
    private readonly cache: RedisCacheService,
    private readonly logger: StructuredLogger,
    private readonly rabbitmqPublisher: RabbitmqPublisherService,
  ) {}

  async create(dto: CreateSpaceDto): Promise<Space> {
    const space = await this.repository.create({
      ...dto,
      status: dto.status ?? SpaceStatus.Active,
      availabilityStatus:
        dto.availabilityStatus ?? SpaceAvailabilityStatus.Available,
    });

    await this.invalidateCache();
    this.logger.log('Space created', 'SpaceService');
    await this.rabbitmqPublisher.publish('space.created', {
    userId: 'admin',
    title: 'Space created',
    message: `Space ${space.name} was created.`,
    type: 'INFO',
    sourceService: 'space-availability-service',
    eventType: 'SpaceCreated',
    spaceId: space.id,
    name: space.name,
    location: space.location,
    status: space.status,
    availabilityStatus: space.availabilityStatus,
  });
    return space;
  }

  async findAll(filters: SpaceFilters = {}): Promise<Space[]> {
    const cacheKey = `spaces:list:${JSON.stringify(filters)}`;
    const cached = await this.cache.get<Space[]>(cacheKey);
    if (cached) return cached;

    const spaces = await this.repository.findAll(filters);
    await this.cache.set(cacheKey, spaces, 60);
    return spaces;
  }

  async findById(id: string): Promise<Space> {
    const cacheKey = `spaces:${id}`;
    const cached = await this.cache.get<Space>(cacheKey);
    if (cached) return cached;

    const space = await this.repository.findById(id);
    if (!space) throw new NotFoundException(`Space ${id} was not found`);

    await this.cache.set(cacheKey, space, 60);
    return space;
  }

  async update(id: string, dto: UpdateSpaceDto): Promise<Space> {
    const space = await this.repository.update(id, dto);
    if (!space) throw new NotFoundException(`Space ${id} was not found`);

    await this.invalidateCache(id);
    this.logger.log('Space updated', 'SpaceService');
    await this.rabbitmqPublisher.publish('space.updated', {
    userId: 'admin',
    title: 'Space updated',
    message: `Space ${space.name} was updated.`,
    type: 'INFO',
    sourceService: 'space-availability-service',
    eventType: 'SpaceUpdated',
    spaceId: space.id,
    name: space.name,
    location: space.location,
    status: space.status,
    availabilityStatus: space.availabilityStatus,
  });
    return space;
  }

  async deactivate(id: string): Promise<Space> {
    const space = await this.repository.updateStatus(id, SpaceStatus.Inactive);
    if (!space) throw new NotFoundException(`Space ${id} was not found`);

    await this.invalidateCache(id);
    this.logger.log('Space deactivated', 'SpaceService');
    await this.rabbitmqPublisher.publish('space.deactivated', {
    userId: 'admin',
    title: 'Space deactivated',
    message: `Space ${space.name} was deactivated.`,
    type: 'WARNING',
    sourceService: 'space-availability-service',
    eventType: 'SpaceDeactivated',
    spaceId: space.id,
    name: space.name,
    location: space.location,
    status: space.status,
    availabilityStatus: space.availabilityStatus,
  });
    return space;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new NotFoundException(`Space ${id} was not found`);

    await this.invalidateCache(id);
    this.logger.log('Space deleted', 'SpaceService');
    return { deleted };
  }

  async updateAvailability(
    id: string,
    dto: UpdateSpaceAvailabilityDto,
  ): Promise<Space> {
    const space = await this.repository.updateAvailability(
      id,
      dto.availabilityStatus,
    );
    if (!space) throw new NotFoundException(`Space ${id} was not found`);

    await this.invalidateCache(id);
    this.logger.log('Space availability changed', 'SpaceService');
    await this.rabbitmqPublisher.publish('space.availability.updated', {
      userId: 'admin',
      title: 'Space availability updated',
      message: `Space ${space.name} availability changed to ${space.availabilityStatus}.`,
      type:
        space.availabilityStatus === SpaceAvailabilityStatus.Available
          ? 'INFO'
          : 'WARNING',
      sourceService: 'space-availability-service',
      eventType: 'SpaceAvailabilityUpdated',
      spaceId: space.id,
      name: space.name,
      location: space.location,
      status: space.status,
      availabilityStatus: space.availabilityStatus,
    });
    return space;
  }

  async findAvailable(): Promise<Space[]> {
    return this.findAll({ availabilityStatus: SpaceAvailabilityStatus.Available });
  }

  async findByType(type: SpaceType): Promise<Space[]> {
    return this.findAll({ type });
  }

  async findByLocation(location: string): Promise<Space[]> {
    return this.findAll({ location });
  }

  async checkAvailability(id: string): Promise<{
    spaceId: string;
    available: boolean;
    status: SpaceStatus;
    availabilityStatus: SpaceAvailabilityStatus;
    openingTime: string;
    closingTime: string;
  }> {
    const space = await this.findById(id);
    return {
      spaceId: space.id,
      available: space.isCurrentlyAvailable(),
      status: space.status,
      availabilityStatus: space.availabilityStatus,
      openingTime: space.openingTime,
      closingTime: space.closingTime,
    };
  }

  async createReservation(dto: CreateSpaceReservationDto): Promise<{
    id: string;
    spaceId: string;
    userId?: string;
    purpose?: string;
    startTime?: string;
    endTime?: string;
    status: 'reserved';
    space: Space;
  }> {
    const space = await this.updateAvailability(dto.spaceId, {
      availabilityStatus: SpaceAvailabilityStatus.Reserved,
    });

    await this.rabbitmqPublisher.publish('space.reservation.created', {
      userId: dto.userId || 'admin',
      title: 'Space reservation created',
      message: `Space ${space.name} was reserved.`,
      type: 'INFO',
      sourceService: 'space-availability-service',
      eventType: 'SpaceReservationCreated',
      spaceId: space.id,
      name: space.name,
      location: space.location,
      purpose: dto.purpose,
      startTime: dto.startTime,
      endTime: dto.endTime,
      availabilityStatus: space.availabilityStatus,
    });

    return {
      id: `reservation-${Date.now()}`,
      spaceId: space.id,
      userId: dto.userId,
      purpose: dto.purpose,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: 'reserved',
      space,
    };
  }
  private async invalidateCache(id?: string): Promise<void> {
    await this.cache.del('spaces:list:{}');
    if (id) await this.cache.del(`spaces:${id}`);
  }
}

