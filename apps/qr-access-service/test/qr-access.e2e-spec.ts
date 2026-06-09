import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');

import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { QrAccessStatus } from '../src/qr-access/enums/qr-access-status.enum';
import { QrAccessController } from '../src/qr-access/qr-access.controller';
import { QrAccessService } from '../src/qr-access/qr-access.service';

describe('QrAccessController HTTP functional flow', () => {
  let app: INestApplication;

  const qrAccessRecord = {
    id: '8a05c890-d302-4b19-b8cb-f1b5f633b451',
    userId: 'student-001',
    qrCode: 'QR-ACCESS-123',
    accessPoint: 'main-library',
    status: QrAccessStatus.ACTIVE,
    attemptsCount: 0,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    validatedAt: null,
    lastAttemptAt: null,
    lastDenialReason: null,
    createdAt: new Date().toISOString(),
  };

  const service = {
    generate: jest.fn(),
    validate: jest.fn(),
    revoke: jest.fn(),
    findLogs: jest.fn(),
    findById: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [QrAccessController],
      providers: [
        {
          provide: QrAccessService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('generates a QR access code through REST', async () => {
    service.generate.mockResolvedValue(qrAccessRecord);

    await request(app.getHttpServer())
      .post('/qr-access/generate')
      .send({
        userId: 'student-001',
        accessPoint: 'main-library',
        expiresInMinutes: 15,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.qrCode).toBe('QR-ACCESS-123');
        expect(body.status).toBe(QrAccessStatus.ACTIVE);
      });
  });

  it('rejects invalid QR generation payloads', async () => {
    await request(app.getHttpServer())
      .post('/qr-access/generate')
      .send({
        userId: '',
        accessPoint: 'main-library',
        expiresInMinutes: 0,
      })
      .expect(400);
  });

  it('validates a QR access code through REST', async () => {
    service.validate.mockResolvedValue({
      ...qrAccessRecord,
      status: QrAccessStatus.USED,
      attemptsCount: 1,
      validatedAt: new Date().toISOString(),
    });

    await request(app.getHttpServer())
      .post('/qr-access/validate')
      .send({
        qrCode: 'QR-ACCESS-123',
        accessPoint: 'main-library',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.status).toBe(QrAccessStatus.USED);
        expect(body.attemptsCount).toBe(1);
      });
  });

  it('revokes a QR access code through REST', async () => {
    service.revoke.mockResolvedValue({
      ...qrAccessRecord,
      status: QrAccessStatus.REVOKED,
      lastDenialReason: 'Manual security revocation.',
    });

    await request(app.getHttpServer())
      .patch(`/qr-access/${qrAccessRecord.id}/revoke`)
      .send({ reason: 'Manual security revocation.' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe(QrAccessStatus.REVOKED);
      });
  });
});
