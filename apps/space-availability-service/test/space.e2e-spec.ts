import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

const httpRequest = request as any;
import { SpaceAvailabilityStatus, SpaceStatus, SpaceType } from '../src/space/domain/space-status.enum';
import { SpaceService } from '../src/space/application/use-cases/space.service';
import { SpaceController } from '../src/space/interfaces/http/space.controller';

const space = {
  id: 'space-1',
  name: 'Study Area B',
  type: SpaceType.StudyArea,
  location: 'Library Floor 2',
  capacity: 20,
  status: SpaceStatus.Active,
  availabilityStatus: SpaceAvailabilityStatus.Available,
  openingTime: '08:00',
  closingTime: '20:00',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Space HTTP functional tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SpaceController],
      providers: [
        {
          provide: SpaceService,
          useValue: {
            create: jest.fn().mockResolvedValue(space),
            findAll: jest.fn().mockResolvedValue([space]),
            findAvailable: jest.fn().mockResolvedValue([space]),
            findByType: jest.fn().mockResolvedValue([space]),
            findByLocation: jest.fn().mockResolvedValue([space]),
            findById: jest.fn().mockResolvedValue(space),
            update: jest.fn().mockResolvedValue(space),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
            deactivate: jest.fn().mockResolvedValue({ ...space, status: SpaceStatus.Inactive }),
            updateAvailability: jest.fn().mockResolvedValue(space),
            checkAvailability: jest.fn().mockResolvedValue({
              spaceId: space.id,
              available: true,
              status: space.status,
              availabilityStatus: space.availabilityStatus,
              openingTime: space.openingTime,
              closingTime: space.closingTime,
            }),
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

  it('POST /spaces creates a space', () => {
    return httpRequest(app.getHttpServer())
      .post('/spaces')
      .send({
        name: 'Study Area B',
        type: 'study_area',
        location: 'Library Floor 2',
        capacity: 20,
        openingTime: '08:00',
        closingTime: '20:00',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBe('space-1');
        expect(body.availabilityStatus).toBe('available');
      });
  });

  it('GET /spaces returns spaces', () => {
    return httpRequest(app.getHttpServer())
      .get('/spaces')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
      });
  });

  it('GET /spaces/:id/check-availability returns availability', () => {
    return httpRequest(app.getHttpServer())
      .get('/spaces/space-1/check-availability')
      .expect(200)
      .expect(({ body }) => {
        expect(body.spaceId).toBe('space-1');
        expect(body.available).toBe(true);
      });
  });
});
