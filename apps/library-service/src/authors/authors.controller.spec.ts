import { Test } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

describe('AuthorsController', () => {
  let controller: AuthorsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        {
          provide: AuthorsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = moduleRef.get(AuthorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});