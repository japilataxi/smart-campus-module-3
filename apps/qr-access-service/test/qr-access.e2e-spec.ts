import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QrAccessController } from '../src/qr-access/interfaces/http/qr-access.controller';
import { QrAccessService } from '../src/qr-access/application/use-cases/qr-access.service';
import { QrAccessStatus } from '../src/qr-access/domain/qr-access-status.enum';

const record = {
  id: 'qr-1',
  userId: 'user-1',
  qrCode: 'QR-test',
  accessType: 'LIBRARY_ENTRY',
  location: 'Main Library',
  status: QrAccessStatus.ACTIVE,
  expirationDate: new Date(Date.now() + 60000),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('QR Access HTTP functional tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [QrAccessController],
      providers: [
        {
          provide: QrAccessService,
          useValue: {
            generate: jest.fn().mockResolvedValue(record),
            findAll: jest.fn().mockResolvedValue([record]),
            validate: jest.fn().mockResolvedValue({ granted: true, status: QrAccessStatus.USED, message: 'Access granted', qrAccess: record }),
            revoke: jest.fn().mockResolvedValue({ ...record, status: QrAccessStatus.REVOKED }),
            findLogs: jest.fn().mockResolvedValue([]),
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

  it('POST /qr-access generates a code', () => {
    return request(app.getHttpServer())
      .post('/qr-access')
      .send({
        userId: 'user-1',
        expirationDate: new Date(Date.now() + 60000).toISOString(),
        accessType: 'LIBRARY_ENTRY',
        location: 'Main Library',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.qrCode).toBe('QR-test');
      });
  });

  it('POST /qr-access/validate validates a code', () => {
    return request(app.getHttpServer())
      .post('/qr-access/validate')
      .send({ qrCode: 'QR-test' })
      .expect(201)
      .expect(({ body }) => {
        expect(body.granted).toBe(true);
      });
  });

  it('GET /qr-access/logs returns logs', () => {
    return request(app.getHttpServer()).get('/qr-access/logs').expect(200).expect([]);
  });
});
