import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTransportRouteDto } from '../../application/dto/create-transport-route.dto';
import { CreateTransportStopDto } from '../../application/dto/create-transport-stop.dto';
import { CreateTransportVehicleDto } from '../../application/dto/create-transport-vehicle.dto';
import { CreateTransportScheduleDto } from '../../application/dto/create-transport-schedule.dto';
import { UpdateTransportRouteDto } from '../../application/dto/update-transport-route.dto';
import { TransportService } from '../../application/use-cases/transport.service';

@ApiTags('Transport')
@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post('routes')
  @ApiOperation({ summary: 'Create a transport route' })
  createRoute(@Body() body: CreateTransportRouteDto) {
    return this.transportService.createRoute(body);
  }

  @Get('routes')
  @ApiOperation({ summary: 'List transport routes' })
  findRoutes() {
    return this.transportService.findRoutes();
  }

  @Get('routes/:id')
  @ApiOperation({ summary: 'Get a transport route by id' })
  findRouteById(@Param('id') id: string) {
    return this.transportService.findRouteById(id);
  }

  @Patch('routes/:id')
  @ApiOperation({ summary: 'Update a transport route' })
  updateRoute(@Param('id') id: string, @Body() body: UpdateTransportRouteDto) {
    return this.transportService.updateRoute(id, body);
  }

  @Get('routes/:id/availability')
  @ApiOperation({ summary: 'Show route availability' })
  getAvailability(@Param('id') id: string) {
    return this.transportService.getRouteAvailability(id);
  }

  @Post('stops')
  @ApiOperation({ summary: 'Create a transport stop' })
  createStop(@Body() body: CreateTransportStopDto) {
    return this.transportService.createStop(body);
  }

  @Get('stops')
  @ApiOperation({ summary: 'List transport stops' })
  findStops(@Query('routeId') routeId?: string) {
    return this.transportService.findStops(routeId);
  }

  @Post('vehicles')
  @ApiOperation({ summary: 'Create a transport vehicle' })
  createVehicle(@Body() body: CreateTransportVehicleDto) {
    return this.transportService.createVehicle(body);
  }

  @Get('vehicles')
  @ApiOperation({ summary: 'List transport vehicles' })
  findVehicles() {
    return this.transportService.findVehicles();
  }

  @Post('schedules')
  @ApiOperation({ summary: 'Create a transport schedule' })
  createSchedule(@Body() body: CreateTransportScheduleDto) {
    return this.transportService.createSchedule(body);
  }

  @Get('schedules')
  @ApiOperation({ summary: 'List transport schedules' })
  findSchedules(@Query('routeId') routeId?: string) {
    return this.transportService.findSchedules(routeId);
  }
}

