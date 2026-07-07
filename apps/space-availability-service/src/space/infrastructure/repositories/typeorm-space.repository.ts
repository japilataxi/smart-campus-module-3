import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import {
  SpaceFilters,
  SpaceRepositoryPort,
} from '../../application/ports/space-repository.port';
import { Space } from '../../domain/space.model';
import {
  SpaceAvailabilityStatus,
  SpaceStatus,
} from '../../domain/space-status.enum';
import { SpaceEntity } from '../entities/space.entity';

@Injectable()
export class TypeOrmSpaceRepository implements SpaceRepositoryPort {
  constructor(
    @InjectRepository(SpaceEntity)
    private readonly repository: Repository<SpaceEntity>,
  ) {}

  async create(space: Partial<Space>): Promise<Space> {
    const entity = this.repository.create(space);
    return this.toDomain(await this.repository.save(entity));
  }

  async findAll(filters: SpaceFilters = {}): Promise<Space[]> {
  const query = this.repository.createQueryBuilder('space');

  if (filters.type) {
    query.andWhere('space.type = :type', { type: filters.type });
  }

  if (filters.availabilityStatus) {
    query.andWhere('space.availabilityStatus = :availabilityStatus', {
      availabilityStatus: filters.availabilityStatus,
    });
  }

  if (filters.location) {
    query.andWhere('space.location ILIKE :location', {
      location: `%${filters.location}%`,
    });
  }

  const spaces = await query
    .orderBy('space.createdAt', 'DESC')
    .getMany();

  return spaces.map((space) => this.toDomain(space));
}

  async findById(id: string): Promise<Space | null> {
    const space = await this.repository.findOne({ where: { id } });
    return space ? this.toDomain(space) : null;
  }

  async update(id: string, space: Partial<Space>): Promise<Space | null> {
    await this.repository.update(id, space);
    return this.findById(id);
  }

  async updateAvailability(
    id: string,
    availabilityStatus: SpaceAvailabilityStatus,
  ): Promise<Space | null> {
    await this.repository.update(id, { availabilityStatus });
    return this.findById(id);
  }

  async updateStatus(id: string, status: SpaceStatus): Promise<Space | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return Boolean(result.affected);
  }

  private toDomain(entity: SpaceEntity): Space {
    return new Space(
      entity.id,
      entity.name,
      entity.type,
      entity.location,
      entity.capacity,
      entity.status,
      entity.availabilityStatus,
      entity.openingTime,
      entity.closingTime,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
