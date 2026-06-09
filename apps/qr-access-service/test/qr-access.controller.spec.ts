import { Test, TestingModule } from '@nestjs/testing';

import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { QrAccessController } from '../src/qr-access/qr-access.controller';
import { QrAccessService } from '../src/qr-access/qr-access.service';

describe('QrAccessController', () => {
  let controller: QrAccessController;
  const service = {
    generate: jest.fn(),
    validate: jest.fn(),
    revoke: jest.fn(),
    findLogs: jest.fn(),
    findById: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    controller = module.get(QrAccessController);
  });

  it('delegates QR generation to the service', async () => {
    const dto = {
      userId: 'student-001',
      accessPoint: 'main-library',
      expiresInMinutes: 10,
    };
    service.generate.mockResolvedValue({ id: 'qr-id', ...dto });

    await expect(controller.generate(dto)).resolves.toEqual({
      id: 'qr-id',
      ...dto,
    });
  });

  it('delegates QR log retrieval to the service', async () => {
    service.findLogs.mockResolvedValue([]);

    await expect(controller.findLogs()).resolves.toEqual([]);
  });
});
