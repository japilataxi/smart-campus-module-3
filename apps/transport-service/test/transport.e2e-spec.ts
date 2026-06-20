import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

const httpRequest = request as any;
import { TransportRouteStatus } from '../src/transport/domain/transport-status.enum';
import { TransportController } from '../src/transport/interfaces/http/transport.controller';
import { TransportService } from '../src/transport/application/use-cases/transport.service';

const route = {
  id: 'route-1',
  name: 'Campus Loop',
  origin: 'Main Gate',
  destination: 'Library',
  status: TransportRouteStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Transport HTTP functional tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TransportController],
      providers: [
        {
          provide: TransportService,
          useValue: {
            createRoute: jest.fn().mockResolvedValue(route),
            findRoutes: jest.fn().mockResolvedValue([route]),
            findRouteById: jest.fn().mockResolvedValue(route),
            updateRoute: jest.fn().mockResolvedValue(route),
            getRouteAvailability: jest.fn().mockResolvedValue({ routeId: route.id, available: true }),
            createStop: jest.fn().mockResolvedValue({ id: 'stop-1', name: 'Library Stop' }),
            findStops: jest.fn().mockResolvedValue([]),
            createVehicle: jest.fn().mockResolvedValue({ id: 'vehicle-1', code: 'BUS-001' }),
            findVehicles: jest.fn().mockResolvedValue([]),
            createSchedule: jest.fn().mockResolvedValue({ id: 'schedule-1', routeId: route.id }),
            findSchedules: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /transport/routes creates a route', () => {
    return httpRequest(app.getHttpServer())
      .post('/transport/routes')
      .send({ name: 'Campus Loop', origin: 'Main Gate', destination: 'Library' })
      .expect(201)
      .expect(({ body }) => {
        expect(body.name).toBe('Campus Loop');
      });
  });

  it('GET /transport/routes returns routes', () => {
    return httpRequest(app.getHttpServer()).get('/transport/routes').expect(200).expect(({ body }) => {
      expect(body).toHaveLength(1);
    });
  });

  it('GET /transport/routes/:id/availability returns availability', () => {
    return httpRequest(app.getHttpServer())
      .get('/transport/routes/route-1/availability')
      .expect(200)
      .expect(({ body }) => {
        expect(body.available).toBe(true);
      });
  });
});

