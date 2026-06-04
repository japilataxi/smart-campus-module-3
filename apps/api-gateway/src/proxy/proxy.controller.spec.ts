import { Test } from '@nestjs/testing';

import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';

describe('ProxyController', () => {
  let controller: ProxyController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProxyController],
      providers: [
        {
          provide: ProxyService,
          useValue: {},
        },
      ],
    }).compile();

    controller = moduleRef.get(ProxyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});