import { Test } from '@nestjs/testing';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { RabbitmqPublisherService } from '../rabbitmq/rabbitmq-publisher.service';

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

        {
          provide: RabbitmqPublisherService,
          useValue: {
            publish: jest.fn(),
            emit: jest.fn(),
          },
        }
      ],
    }).compile();

    controller = moduleRef.get(LoansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});