import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CreateCampusEventDto } from '../../../application/dto/create-campus-event.dto';
import { RegisterEventDto } from '../../../application/dto/register-event.dto';
import { UpdateCampusEventDto } from '../../../application/dto/update-campus-event.dto';
import { EventsService } from '../../../application/use-cases/events.service';

import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('Campus Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a campus event (Admin only)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body() dto: CreateCampusEventDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const createdByUserId =
      user.sub || user.userId || user.id || dto.createdByUserId;

    return this.eventsService.create({
      ...dto,
      createdByUserId,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'List active campus events',
  })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Campus Event ID',
  })
  @ApiOperation({
    summary: 'Get campus event details',
  })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Campus Event ID',
  })
  @ApiOperation({
    summary: 'Update a campus event (Admin only)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCampusEventDto,
  ) {
    return this.eventsService.update(id, dto);
  }

  @Patch(':id/cancel')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Campus Event ID',
  })
  @ApiOperation({
    summary: 'Cancel a campus event (Admin only)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  cancel(@Param('id') id: string) {
    return this.eventsService.cancel(id);
  }

  @Post(':id/register')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Campus Event ID',
  })
  @ApiBody({
    type: RegisterEventDto,
  })
  @ApiOperation({
    summary: 'Register current student for an event',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  register(
    @Param('id') id: string,
    @Body() dto: RegisterEventDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const userId = user.sub || user.userId || user.id || dto.userId;

    return this.eventsService.register(id, userId);
  }

  @Delete(':id/register')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Campus Event ID',
  })
  @ApiBody({
    type: RegisterEventDto,
  })
  @ApiOperation({
    summary: 'Cancel current student registration',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  cancelRegistration(
    @Param('id') id: string,
    @Body() dto: RegisterEventDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const userId = user.sub || user.userId || user.id || dto.userId;

    return this.eventsService.cancelRegistration(id, userId);
  }

  @Get(':id/registrations')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Campus Event ID',
  })
  @ApiOperation({
    summary: 'List event registrations (Admin only)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getRegistrations(@Param('id') id: string) {
    return this.eventsService.getRegistrations(id);
  }
}