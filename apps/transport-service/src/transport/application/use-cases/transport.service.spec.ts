import { Test } from '@nestjs/testing';
import { RedisCacheService } from '../../../common/cache/redis-cache.service';
import { TRANSPORT_REPOSITORY } from '../ports/transport-repository.port';
import { TransportService } from './transport.service';
import { RabbitmqPublisherService } from '../../../rabbitmq/rabbitmq-publisher.service';

describe('TransportService', () => {
  let service: TransportService;
  const repository = {
    createRoute: jest.fn(),
    findRoutes: jest.fn(),
    findRouteById: jest.fn(),
    updateRoute: jest.fn(),
    createStop: jest.fn(),
    findStops: jest.fn(),
    createVehicle: jest.fn(),
    findVehicles: jest.fn(),
    createSchedule: jest.fn(),
    findSchedules: jest.fn(),
  };
  const cache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransportService,
        { provide: TRANSPORT_REPOSITORY, useValue: repository },
        { provide: RedisCacheService, useValue: cache },
        {
          provide: RabbitmqPublisherService,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(TransportService);
  });

  it('creates an active route by default', async () => {
    repository.createRoute.mockResolvedValue({ id: 'route-id', status: 'ACTIVE' });

    const result = await service.createRoute({
      name: 'Campus Loop',
      origin: 'Gate',
      destination: 'Library',
    });

    expect(repository.createRoute).toHaveBeenCalledWith(expect.objectContaining({ status: 'ACTIVE' }));
    expect(result).toEqual({ id: 'route-id', status: 'ACTIVE' });
  });

  it('returns route availability', async () => {
    repository.findRouteById.mockResolvedValue({ id: 'route-id', name: 'Campus Loop', status: 'ACTIVE' });
    repository.findSchedules.mockResolvedValue([{ id: 'schedule-id', status: 'SCHEDULED' }]);
    cache.get.mockResolvedValue(null);

    const result = await service.getRouteAvailability('route-id');

    expect(result).toMatchObject({ available: true, routeId: 'route-id' });
  });
});

