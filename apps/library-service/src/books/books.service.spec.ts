import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { AuthorsService } from '../authors/authors.service';
import { CategoriesService } from '../categories/categories.service';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: {},
        },
        {
          provide: AuthorsService,
          useValue: {},
        },
        {
          provide: CategoriesService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});