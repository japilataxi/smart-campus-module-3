import { Test } from '@nestjs/testing';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';

describe('LoansController', () => {
  let controller: LoansController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LoansController],
      providers: [
        {
          provide: LoansService,
          useValue: {},
        },
      ],
    }).compile();

    controller = moduleRef.get(LoansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});