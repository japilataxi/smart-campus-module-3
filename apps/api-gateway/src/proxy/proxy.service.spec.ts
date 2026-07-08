import { HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { CircuitBreakerService } from '../common/resilience/circuit-breaker.service';
import { ProxyService } from './proxy.service';

describe('ProxyService', () => {
  let service: ProxyService;
  let httpService: { request: jest.Mock };

  beforeEach(async () => {
    httpService = {
      request: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProxyService,
        CircuitBreakerService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    service = moduleRef.get(ProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('successful downstream call returns data normally', async () => {
    httpService.request.mockReturnValue(of({ data: { id: 'book-1' } }));

    await expect(
      service.forwardRequest({
        method: 'GET',
        targetUrl: 'http://localhost:3002/books/book-1',
      }),
    ).resolves.toEqual({ id: 'book-1' });
  });

  it('failed downstream call returns a 503 fallback exception', async () => {
    httpService.request.mockReturnValue(
      throwError(() => new Error('library-service unavailable')),
    );

    await expect(
      service.forwardRequest({
        method: 'GET',
        targetUrl: 'http://localhost:3002/books',
      }),
    ).rejects.toMatchObject({
      response: {
        statusCode: 503,
        message: 'Service temporarily unavailable',
        service: 'library-service',
      },
      status: 503,
    });
  });

  it('client errors continue to be forwarded without fallback', async () => {
    httpService.request.mockReturnValue(
      throwError(() => ({
        response: {
          status: 404,
          data: { message: 'Book not found' },
        },
      })),
    );

    await expect(
      service.forwardRequest({
        method: 'GET',
        targetUrl: 'http://localhost:3002/books/missing',
      }),
    ).rejects.toEqual(new HttpException({ message: 'Book not found' }, 404));
  });
});
