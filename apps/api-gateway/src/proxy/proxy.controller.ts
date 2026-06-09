import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProxyService } from './proxy.service';

@ApiTags('API Gateway Proxy')
@Controller('api')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('auth/users')
  @ApiOperation({ summary: 'Forward GET users to auth-service' })
  proxyUsersGet(@Headers('authorization') authorization?: string) {
    const baseUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/users`,
      authorization,
    });
  }

  @Patch('auth/users/:id/roles')
  @ApiOperation({ summary: 'Forward PATCH user roles to auth-service' })
  proxyUserRolesPatch(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    return this.proxyService.forwardRequest({
      method: 'PATCH',
      targetUrl: `${baseUrl}/users/${id}/roles`,
      body,
      authorization,
    });
  }

  @Post('auth/:path')
  @ApiOperation({ summary: 'Forward POST requests to auth-service' })
  proxyAuthPost(
    @Param('path') path: string,
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    return this.proxyService.forwardRequest({
      method: 'POST',
      targetUrl: `${baseUrl}/auth/${path}`,
      body,
      authorization,
    });
  }

  @Get('auth/:path')
  @ApiOperation({ summary: 'Forward GET requests to auth-service' })
  proxyAuthGet(
    @Param('path') path: string,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/auth/${path}`,
      authorization,
    });
  }

  @Post('library/:resource')
  @ApiOperation({ summary: 'Forward POST requests to library-service' })
  proxyLibraryPost(
    @Param('resource') resource: string,
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.LIBRARY_SERVICE_URL || 'http://localhost:3002';

    return this.proxyService.forwardRequest({
      method: 'POST',
      targetUrl: `${baseUrl}/${resource}`,
      body,
      authorization,
    });
  }

  @Get('library/:resource/:id')
  @ApiOperation({ summary: 'Forward GET by id requests to library-service' })
  proxyLibraryGetById(
    @Param('resource') resource: string,
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.LIBRARY_SERVICE_URL || 'http://localhost:3002';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/${resource}/${id}`,
      authorization,
    });
  }

@Patch('library/:resource/:id/:action')
@ApiOperation({ summary: 'Forward PATCH action requests to library-service' })
proxyLibraryPatchAction(
  @Param('resource') resource: string,
  @Param('id') id: string,
  @Param('action') action: string,
  @Body() body: unknown,
  @Headers('authorization') authorization?: string,
) {
  const baseUrl = process.env.LIBRARY_SERVICE_URL || 'http://localhost:3002';

  return this.proxyService.forwardRequest({
    method: 'PATCH',
    targetUrl: `${baseUrl}/${resource}/${id}/${action}`,
    body,
    authorization,
  });
}

  @Get('library/:resource')
  @ApiOperation({ summary: 'Forward GET requests to library-service' })
  proxyLibraryGet(
    @Param('resource') resource: string,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.LIBRARY_SERVICE_URL || 'http://localhost:3002';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/${resource}`,
      authorization,
    });
  }  
}