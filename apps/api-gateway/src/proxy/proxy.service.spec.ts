import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';

import { ProxyService } from './proxy.service';

describe('ProxyService', () => {
  let service: ProxyService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProxyService,
        {
          provide: HttpService,
          useValue: {
            request: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});