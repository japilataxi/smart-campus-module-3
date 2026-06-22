import { Test } from '@nestjs/testing';

import { RedisCacheService } from '../../../common/cache/redis-cache.service';
import { StructuredLogger } from '../../../common/logging/structured-logger.service';
import { SPACE_REPOSITORY } from '../ports/space-repository.port';
import { SpaceService } from './space.service';
import {
  SpaceAvailabilityStatus,
  SpaceStatus,
  SpaceType,
} from '../../domain/space-status.enum';

const space = {
  id: 'space-1',
  name: 'Laboratory A-101',
  type: SpaceType.Laboratory,
  location: 'Building A',
  capacity: 32,
  status: SpaceStatus.Active,
  availabilityStatus: SpaceAvailabilityStatus.Available,
  openingTime: '07:00',
  closingTime: '21:00',
  createdAt: new Date(),
  updatedAt: new Date(),
  isCurrentlyAvailable: () => true,
};

describe('SpaceService', () => {
  let service: SpaceService;
  const repository = {
    create: jest.fn().mockResolvedValue(space),
    findAll: jest.fn().mockResolvedValue([space]),
    findById: jest.fn().mockResolvedValue(space),
    update: jest.fn().mockResolvedValue(space),
    updateAvailability: jest.fn().mockResolvedValue(space),
    updateStatus: jest.fn().mockResolvedValue(space),
    delete: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SpaceService,
        { provide: SPACE_REPOSITORY, useValue: repository },
        {
          provide: RedisCacheService,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
        {
          provide: StructuredLogger,
          useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    service = moduleRef.get(SpaceService);
  });

  it('creates a space with defaults', async () => {
    await expect(
      service.create({
        name: 'Laboratory A-101',
        type: SpaceType.Laboratory,
        location: 'Building A',
        capacity: 32,
        openingTime: '07:00',
        closingTime: '21:00',
      }),
    ).resolves.toEqual(space);
  });

  it('checks availability', async () => {
    await expect(service.checkAvailability('space-1')).resolves.toMatchObject({
      spaceId: 'space-1',
      available: true,
    });
  });
});

