import { Test } from '@nestjs/testing';

import { SpaceService } from '../../application/use-cases/space.service';
import { SpaceController } from './space.controller';

describe('SpaceController', () => {
  let controller: SpaceController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SpaceController],
      providers: [
        {
          provide: SpaceService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findAvailable: jest.fn().mockResolvedValue([]),
            findByType: jest.fn().mockResolvedValue([]),
            findByLocation: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(SpaceController);
  });

  it('lists spaces', async () => {
    await expect(controller.findAll()).resolves.toEqual([]);
  });
});
