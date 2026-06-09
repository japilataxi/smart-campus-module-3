import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { QrAccessLog } from '../src/qr-access/entities/qr-access-log.entity';
import { QrAccessStatus } from '../src/qr-access/enums/qr-access-status.enum';
import { QR_ACCESS_CACHE } from '../src/qr-access/ports/qr-access-cache.port';
import { QR_ACCESS_REPOSITORY } from '../src/qr-access/ports/qr-access-repository.port';
import { QrAccessService } from '../src/qr-access/qr-access.service';

const createRepositoryMock = () => ({
  create: jest.fn((entity: Partial<QrAccessLog>) => entity),
  save: jest.fn((entity: Partial<QrAccessLog>) =>
    Promise.resolve({ id: 'qr-id', ...entity }),
  ),
  findLogs: jest.fn(),
  findById: jest.fn(),
  findByQrCode: jest.fn(),
  softRemove: jest.fn(),
});
const createCacheMock = () => ({
  getActiveCode: jest.fn().mockResolvedValue(null),
  setActiveCode: jest.fn().mockResolvedValue(undefined),
  deleteCode: jest.fn().mockResolvedValue(undefined),
});

describe('QrAccessService', () => {
  let service: QrAccessService;
  let repository: ReturnType<typeof createRepositoryMock>;
  let cache: ReturnType<typeof createCacheMock>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QrAccessService,
        {
          provide: QR_ACCESS_REPOSITORY,
          useValue: createRepositoryMock(),
        },
        {
          provide: QR_ACCESS_CACHE,
          useValue: createCacheMock(),
        },
      ],
    }).compile();

    service = module.get(QrAccessService);
    repository = module.get(QR_ACCESS_REPOSITORY);
    cache = module.get(QR_ACCESS_CACHE);
  });

  it('generates a QR access record', async () => {
    const result = await service.generate({
      userId: 'student-001',
      accessPoint: 'main-library',
      expiresInMinutes: 10,
    });

    expect(result.qrCode).toMatch(/^QR-/);
    expect(result.status).toBe(QrAccessStatus.ACTIVE);
    expect(repository.save).toHaveBeenCalled();
    expect(cache.setActiveCode).toHaveBeenCalled();
  });

  it('validates a valid QR access record', async () => {
    const qrAccessLog = {
      id: 'qr-id',
      qrCode: 'QR-123',
      accessPoint: 'main-library',
      status: QrAccessStatus.ACTIVE,
      attemptsCount: 0,
      expiresAt: new Date(Date.now() + 60_000),
    } as QrAccessLog;

    repository.findByQrCode.mockResolvedValue(qrAccessLog);

    const result = await service.validate({
      qrCode: 'QR-123',
      accessPoint: 'main-library',
    });

    expect(result.status).toBe(QrAccessStatus.USED);
    expect(result.validatedAt).toBeInstanceOf(Date);
    expect(cache.deleteCode).toHaveBeenCalledWith('QR-123');
  });

  it('rejects an already validated QR access record', async () => {
    repository.findByQrCode.mockResolvedValue({
      qrCode: 'QR-123',
      accessPoint: 'main-library',
      status: QrAccessStatus.USED,
      attemptsCount: 0,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(
      service.validate({ qrCode: 'QR-123', accessPoint: 'main-library' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws when a QR access record is not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
