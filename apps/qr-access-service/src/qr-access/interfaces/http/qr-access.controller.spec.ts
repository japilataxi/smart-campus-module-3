import { Test, TestingModule } from '@nestjs/testing';
import { QrAccessController } from './qr-access.controller';
import { QrAccessService } from '../../application/use-cases/qr-access.service';

const serviceMock = {
  generate: jest.fn(),
  findAll: jest.fn(),
  validate: jest.fn(),
  revoke: jest.fn(),
  findLogs: jest.fn(),
};

describe('QrAccessController', () => {
  let controller: QrAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QrAccessController],
      providers: [{ provide: QrAccessService, useValue: serviceMock }],
    }).compile();

    controller = module.get(QrAccessController);
  });

  it('delegates QR generation to the service layer', async () => {
    const dto = {
      userId: 'user-1',
      expirationDate: new Date().toISOString(),
      accessType: 'LIBRARY_ENTRY',
      location: 'Main Library',
    };

    serviceMock.generate.mockResolvedValue({ id: 'qr-1', ...dto });

    await controller.generate(dto);

    expect(serviceMock.generate).toHaveBeenCalledWith(dto);
  });
});
