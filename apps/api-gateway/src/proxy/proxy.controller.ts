import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Patch,
  Delete,
  Query,
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
  @Get('notifications')
  @ApiOperation({ summary: 'Forward GET notifications to notification-service' })
  proxyNotificationsGet(@Headers('authorization') authorization?: string) {
    const baseUrl =
      process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3010';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/notifications`,
      authorization,
    });
  }

  @Get('notifications/unread')
  @ApiOperation({ summary: 'Forward GET unread notifications to notification-service' })
  proxyNotificationsUnreadGet(@Headers('authorization') authorization?: string) {
    const baseUrl =
      process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3010';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/notifications/unread`,
      authorization,
    });
  }

  @Patch('notifications/:id/read')
  @ApiOperation({ summary: 'Forward PATCH notification read to notification-service' })
  proxyNotificationReadPatch(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl =
      process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3010';

    return this.proxyService.forwardRequest({
      method: 'PATCH',
      targetUrl: `${baseUrl}/notifications/${id}/read`,
      authorization,
    });
  }

  @Patch('notifications/read-all')
  @ApiOperation({ summary: 'Forward PATCH read all notifications to notification-service' })
  proxyNotificationsReadAllPatch(
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl =
      process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3010';

    return this.proxyService.forwardRequest({
      method: 'PATCH',
      targetUrl: `${baseUrl}/notifications/read-all`,
      authorization,
    });
  }

  @Delete('notifications/:id')
  @ApiOperation({ summary: 'Forward DELETE notification to notification-service' })
  proxyNotificationDelete(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl =
      process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3010';

    return this.proxyService.forwardRequest({
      method: 'DELETE',
      targetUrl: `${baseUrl}/notifications/${id}`,
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
  @Get('transport/routes')
  @ApiOperation({ summary: 'Forward GET transport routes to transport-service' })
  proxyTransportRoutesGet(@Headers('authorization') authorization?: string) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/transport/routes`,
      authorization,
    });
  }

  @Post('transport/routes')
  @ApiOperation({ summary: 'Forward POST transport route to transport-service' })
  proxyTransportRoutePost(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';

    return this.proxyService.forwardRequest({
      method: 'POST',
      targetUrl: `${baseUrl}/transport/routes`,
      body,
      authorization,
    });
  }

  @Get('transport/routes/:id')
  @ApiOperation({ summary: 'Forward GET transport route by id to transport-service' })
  proxyTransportRouteGetById(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/transport/routes/${id}`,
      authorization,
    });
  }

  @Patch('transport/routes/:id')
  @ApiOperation({ summary: 'Forward PATCH transport route to transport-service' })
  proxyTransportRoutePatch(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';

    return this.proxyService.forwardRequest({
      method: 'PATCH',
      targetUrl: `${baseUrl}/transport/routes/${id}`,
      body,
      authorization,
    });
  }

  @Get('transport/routes/:id/availability')
  @ApiOperation({ summary: 'Forward GET transport route availability to transport-service' })
  proxyTransportRouteAvailability(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/transport/routes/${id}/availability`,
      authorization,
    });
  }

  @Get('transport/stops')
  @ApiOperation({ summary: 'Forward GET transport stops to transport-service' })
  proxyTransportStopsGet(
    @Query('routeId') routeId?: string,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';
    const query = routeId ? `?routeId=${routeId}` : '';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/transport/stops${query}`,
      authorization,
    });
  }

  @Post('transport/stops')
  @ApiOperation({ summary: 'Forward POST transport stop to transport-service' })
  proxyTransportStopPost(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';

    return this.proxyService.forwardRequest({
      method: 'POST',
      targetUrl: `${baseUrl}/transport/stops`,
      body,
      authorization,
    });
  }

  @Get('transport/vehicles')
  @ApiOperation({ summary: 'Forward GET transport vehicles to transport-service' })
  proxyTransportVehiclesGet(@Headers('authorization') authorization?: string) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/transport/vehicles`,
      authorization,
    });
  }

  @Post('transport/vehicles')
  @ApiOperation({ summary: 'Forward POST transport vehicle to transport-service' })
  proxyTransportVehiclePost(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';

    return this.proxyService.forwardRequest({
      method: 'POST',
      targetUrl: `${baseUrl}/transport/vehicles`,
      body,
      authorization,
    });
  }

  @Get('transport/schedules')
  @ApiOperation({ summary: 'Forward GET transport schedules to transport-service' })
  proxyTransportSchedulesGet(
    @Query('routeId') routeId?: string,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';
    const query = routeId ? `?routeId=${routeId}` : '';

    return this.proxyService.forwardRequest({
      method: 'GET',
      targetUrl: `${baseUrl}/transport/schedules${query}`,
      authorization,
    });
  }

  @Post('transport/schedules')
  @ApiOperation({ summary: 'Forward POST transport schedule to transport-service' })
  proxyTransportSchedulePost(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    const baseUrl = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3022';

    return this.proxyService.forwardRequest({
      method: 'POST',
      targetUrl: `${baseUrl}/transport/schedules`,
      body,
      authorization,
    });
  }
}



