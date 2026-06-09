import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(private readonly httpService: HttpService) {}

  async forwardRequest(params: {
    method: string;
    targetUrl: string;
    body?: unknown;
    authorization?: string;
  }) {
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: params.method,
          url: params.targetUrl,
          data: params.body,
          headers: {
            ...(params.authorization
              ? { Authorization: params.authorization }
              : {}),
          },
        }),
      );

      return response.data;
    } catch (error: any) {
      const status = error.response?.status || 500;
      const data = error.response?.data || {
        message: 'Internal gateway error',
      };

      throw new HttpException(data, status);
    }
  }
}