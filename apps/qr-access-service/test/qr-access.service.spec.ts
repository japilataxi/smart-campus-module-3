import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QrAccessLog } from '../src/qr-access/entities/qr-access-log.entity';
import { QrAccessService } from '../src/qr-access/qr-access.service';

type MockRepository<T extends object = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createRepositoryMock = (): MockRepository<QrAccessLog> => ({
  create: jest.fn((entity: Partial<QrAccessLog>) => entity),
  save: jest.fn((entity: Partial<QrAccessLog>) =>
    Promise.resolve({ id: 'qr-id', ...entity }),
  ),
  find: jest.fn(),
  findOne: jest.fn(),
  softRemove: jest.fn(),
});

describe('QrAccessService', () => {
  let service: QrAccessService;
  let repository: MockRepository<QrAccessLog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QrAccessService,
        {
          provide: getRepositoryToken(QrAccessLog),
          useValue: createRepositoryMock(),
        },
      ],
    }).compile();

    service = module.get(QrAccessService);
    repository = module.get(getRepositoryToken(QrAccessLog));
  });

  it('generates a QR access record', async () => {
    const result = await service.generate({
      userId: 'student-001',
      accessPoint: 'main-library',
      expiresInMinutes: 10,
    });

    expect(result.qrCode).toMatch(/^QR-/);
    expect(repository.save).toHaveBeenCalled();
  });

  it('validates a valid QR access record', async () => {
    const qrAccessLog = {
      id: 'qr-id',
      qrCode: 'QR-123',
      accessPoint: 'main-library',
      validated: false,
      expiresAt: new Date(Date.now() + 60_000),
    } as QrAccessLog;

    repository.findOne?.mockResolvedValue(qrAccessLog);

    const result = await service.validate({
      qrCode: 'QR-123',
      accessPoint: 'main-library',
    });

    expect(result.validated).toBe(true);
    expect(result.validatedAt).toBeInstanceOf(Date);
  });

  it('rejects an already validated QR access record', async () => {
    repository.findOne?.mockResolvedValue({
      qrCode: 'QR-123',
      accessPoint: 'main-library',
      validated: true,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(
      service.validate({ qrCode: 'QR-123', accessPoint: 'main-library' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws when a QR access record is not found', async () => {
    repository.findOne?.mockResolvedValue(null);

    await expect(service.findById('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
