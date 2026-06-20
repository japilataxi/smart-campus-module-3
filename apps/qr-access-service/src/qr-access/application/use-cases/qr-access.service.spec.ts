import { Test, TestingModule } from '@nestjs/testing';
import { QrAccessService } from './qr-access.service';
import { QR_ACCESS_REPOSITORY, QrAccessRepositoryPort } from '../ports/qr-access-repository.port';
import { RedisCacheService } from '../../../common/cache/redis-cache.service';
import { StructuredLogger } from '../../../common/logging/structured-logger.service';
import { QrAccessStatus } from '../../domain/qr-access-status.enum';

const activeRecord = {
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

describe('QrAccessService', () => {
  let service: QrAccessService;
  let repository: jest.Mocked<QrAccessRepositoryPort>;

  beforeEach(async () => {
    repository = {
      create: jest.fn().mockResolvedValue(activeRecord),
      findAll: jest.fn().mockResolvedValue([activeRecord]),
      findById: jest.fn().mockResolvedValue(activeRecord),
      findByQrCode: jest.fn().mockResolvedValue(activeRecord),
      updateStatus: jest.fn().mockResolvedValue({ ...activeRecord, status: QrAccessStatus.USED }),
      createLog: jest.fn().mockResolvedValue({
        id: 'log-1',
        qrAccessCodeId: activeRecord.id,
        userId: activeRecord.userId,
        qrCode: activeRecord.qrCode,
        status: QrAccessStatus.USED,
        location: activeRecord.location,
        message: 'Access granted',
        attemptDate: new Date(),
      }),
      findLogs: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QrAccessService,
        { provide: QR_ACCESS_REPOSITORY, useValue: repository },
        {
          provide: RedisCacheService,
          useValue: { get: jest.fn().mockResolvedValue(null), set: jest.fn(), del: jest.fn() },
        },
        { provide: StructuredLogger, useValue: { log: jest.fn(), warn: jest.fn(), error: jest.fn() } },
      ],
    }).compile();

    service = module.get(QrAccessService);
  });

  it('generates an active QR access code', async () => {
    const result = await service.generate({
      userId: 'user-1',
      expirationDate: new Date(Date.now() + 60000).toISOString(),
      accessType: 'LIBRARY_ENTRY',
      location: 'Main Library',
    });

    expect(result.status).toBe(QrAccessStatus.ACTIVE);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', status: QrAccessStatus.ACTIVE }),
    );
  });

  it('validates an active QR access code and marks it as used', async () => {
    const result = await service.validate({ qrCode: 'QR-test', location: 'Main Library' });

    expect(result.granted).toBe(true);
    expect(result.status).toBe(QrAccessStatus.USED);
    expect(repository.updateStatus).toHaveBeenCalledWith(activeRecord.id, QrAccessStatus.USED);
    expect(repository.createLog).toHaveBeenCalled();
  });

  it('denies revoked QR access codes', async () => {
    repository.findByQrCode.mockResolvedValue({ ...activeRecord, status: QrAccessStatus.REVOKED });

    const result = await service.validate({ qrCode: 'QR-test' });

    expect(result.granted).toBe(false);
    expect(result.message).toBe('QR revoked');
  });
});
