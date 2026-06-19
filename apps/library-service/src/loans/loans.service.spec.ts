import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { BooksService } from '../books/books.service';
import { RabbitmqPublisherService } from '../rabbitmq/rabbitmq-publisher.service';

describe('LoansService', () => {
  let service: LoansService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoansService,
        {
          provide: getRepositoryToken(Loan),
          useValue: {},
        },
        {
          provide: BooksService,
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

    service = moduleRef.get(LoansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});