import { Test } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {},
        },
      ],
    }).compile();

    controller = moduleRef.get(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});