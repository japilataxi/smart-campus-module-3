import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { RedisCacheService } from '../../../common/cache/redis-cache.service';
import { StructuredLogger } from '../../../common/logging/structured-logger.service';
import { CreateSpaceDto } from '../dto/create-space.dto';
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

@Injectable()
export class SpaceService {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly repository: SpaceRepositoryPort,
    private readonly cache: RedisCacheService,
    private readonly logger: StructuredLogger,
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
    return space;
  }

  async deactivate(id: string): Promise<Space> {
    const space = await this.repository.updateStatus(id, SpaceStatus.Inactive);
    if (!space) throw new NotFoundException(`Space ${id} was not found`);

    await this.invalidateCache(id);
    this.logger.log('Space deactivated', 'SpaceService');
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

  private async invalidateCache(id?: string): Promise<void> {
    await this.cache.del('spaces:list:{}');
    if (id) await this.cache.del(`spaces:${id}`);
  }
}

