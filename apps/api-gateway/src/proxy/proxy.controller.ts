import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Patch,
  Delete,
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

  @Post('incidents')
  @ApiOperation({ summary: 'Forward POST incidents to campus-incident-service' })
  proxyIncidentPost(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl =
      process.env.CAMPUS_INCIDENT_SERVICE_URL || 'http://localhost:3020';

    return this.proxyService.forwardRequest({
      method: 'POST',
      targetUrl: `${baseUrl}/incidents`,
      body,
      authorization,
    });
  }

@Get('incidents')
@ApiOperation({ summary: 'Forward GET incidents to campus-incident-service' })
proxyIncidentsGet(@Headers('authorization') authorization?: string) {
  const baseUrl =
    process.env.CAMPUS_INCIDENT_SERVICE_URL || 'http://localhost:3020';

  return this.proxyService.forwardRequest({
    method: 'GET',
    targetUrl: `${baseUrl}/incidents`,
    authorization,
  });
}

@Get('incidents/:id')
@ApiOperation({ summary: 'Forward GET incident by id to campus-incident-service' })
proxyIncidentGetById(
  @Param('id') id: string,
  @Headers('authorization') authorization?: string,
) {
  const baseUrl =
    process.env.CAMPUS_INCIDENT_SERVICE_URL || 'http://localhost:3020';

  return this.proxyService.forwardRequest({
    method: 'GET',
    targetUrl: `${baseUrl}/incidents/${id}`,
    authorization,
  });
}

@Patch('incidents/:id')
@ApiOperation({ summary: 'Forward PATCH incident to campus-incident-service' })
proxyIncidentPatch(
  @Param('id') id: string,
  @Body() body: unknown,
  @Headers('authorization') authorization?: string,
) {
  const baseUrl =
    process.env.CAMPUS_INCIDENT_SERVICE_URL || 'http://localhost:3020';

  return this.proxyService.forwardRequest({
    method: 'PATCH',
    targetUrl: `${baseUrl}/incidents/${id}`,
    body,
    authorization,
  });
}

@Delete('incidents/:id')
@ApiOperation({ summary: 'Forward DELETE incident to campus-incident-service' })
proxyIncidentDelete(
  @Param('id') id: string,
  @Headers('authorization') authorization?: string,
) {
  const baseUrl =
    process.env.CAMPUS_INCIDENT_SERVICE_URL || 'http://localhost:3020';

  return this.proxyService.forwardRequest({
    method: 'DELETE',
    targetUrl: `${baseUrl}/incidents/${id}`,
    authorization,
  });
}
  @Get('qr-access')
  @ApiOperation({ summary: 'Forward GET QR access codes to qr-access-service' })
  proxyQrAccessGet(@Headers('authorization') authorization?: string) {
    const baseUrl = process.env.QR_ACCESS_SERVICE_URL || 'http://localhost:3021';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/qr-access`,
      authorization,
    });
  }

  @Post('qr-access')
  @ApiOperation({ summary: 'Forward POST QR access generation to qr-access-service' })
  proxyQrAccessPost(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.QR_ACCESS_SERVICE_URL || 'http://localhost:3021';

    return this.proxyService.forwardRequest({
      method: 'POST',
      targetUrl: `${baseUrl}/qr-access`,
      body,
      authorization,
    });
  }

  @Post('qr-access/validate')
  @ApiOperation({ summary: 'Forward QR access validation to qr-access-service' })
  proxyQrAccessValidate(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.QR_ACCESS_SERVICE_URL || 'http://localhost:3021';

    return this.proxyService.forwardRequest({
      method: 'POST',
      targetUrl: `${baseUrl}/qr-access/validate`,
      body,
      authorization,
    });
  }

  @Patch('qr-access/:id/revoke')
  @ApiOperation({ summary: 'Forward QR access revocation to qr-access-service' })
  proxyQrAccessRevoke(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.QR_ACCESS_SERVICE_URL || 'http://localhost:3021';

    return this.proxyService.forwardRequest({
      method: 'PATCH',
      targetUrl: `${baseUrl}/qr-access/${id}/revoke`,
      authorization,
    });
  }

  @Get('qr-access/logs')
  @ApiOperation({ summary: 'Forward QR access logs to qr-access-service' })
  proxyQrAccessLogs(@Headers('authorization') authorization?: string) {
    const baseUrl = process.env.QR_ACCESS_SERVICE_URL || 'http://localhost:3021';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/qr-access/logs`,
      authorization,
    });
  }
}
