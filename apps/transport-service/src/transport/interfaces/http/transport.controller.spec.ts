import { Test } from '@nestjs/testing';
import { TransportService } from '../../application/use-cases/transport.service';
import { TransportController } from './transport.controller';

describe('TransportController', () => {
  let controller: TransportController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TransportController],
      providers: [
        {
          provide: TransportService,
          useValue: {
            createRoute: jest.fn(),
            findRoutes: jest.fn(),
            findRouteById: jest.fn(),
            updateRoute: jest.fn(),
            getRouteAvailability: jest.fn(),
            createStop: jest.fn(),
            findStops: jest.fn(),
            createVehicle: jest.fn(),
            findVehicles: jest.fn(),
            createSchedule: jest.fn(),
            findSchedules: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(TransportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

