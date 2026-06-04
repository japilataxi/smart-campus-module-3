import { Test } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {},
        },
      ],
    }).compile();

    controller = moduleRef.get(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});