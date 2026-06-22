import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CreateSpaceDto } from '../../application/dto/create-space.dto';
import { UpdateSpaceAvailabilityDto } from '../../application/dto/update-space-availability.dto';
import { UpdateSpaceDto } from '../../application/dto/update-space.dto';
import { SpaceService } from '../../application/use-cases/space.service';
import {
  SpaceAvailabilityStatus,
  SpaceType,
} from '../../domain/space-status.enum';

@ApiTags('Spaces')
@Controller('spaces')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a campus space' })
  create(@Body() body: CreateSpaceDto) {
    return this.spaceService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List campus spaces with optional filters' })
  @ApiQuery({ name: 'type', enum: SpaceType, required: false })
  @ApiQuery({ name: 'availabilityStatus', enum: SpaceAvailabilityStatus, required: false })
  @ApiQuery({ name: 'location', required: false })
  findAll(
    @Query('type') type?: SpaceType,
    @Query('availabilityStatus') availabilityStatus?: SpaceAvailabilityStatus,
    @Query('location') location?: string,
  ) {
    return this.spaceService.findAll({ type, availabilityStatus, location });
  }

  @Get('available')
  @ApiOperation({ summary: 'List available campus spaces' })
  findAvailable() {
    return this.spaceService.findAvailable();
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'List campus spaces by type' })
  @ApiParam({ name: 'type', enum: SpaceType })
  findByType(@Param('type') type: SpaceType) {
    return this.spaceService.findByType(type);
  }

  @Get('location/:location')
  @ApiOperation({ summary: 'List campus spaces by location' })
  findByLocation(@Param('location') location: string) {
    return this.spaceService.findByLocation(location);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campus space by id' })
  findById(@Param('id') id: string) {
    return this.spaceService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a campus space' })
  update(@Param('id') id: string, @Body() body: UpdateSpaceDto) {
    return this.spaceService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campus space' })
  remove(@Param('id') id: string) {
    return this.spaceService.remove(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a campus space' })
  deactivate(@Param('id') id: string) {
    return this.spaceService.deactivate(id);
  }

  @Patch(':id/availability')
  @ApiOperation({ summary: 'Change campus space availability status' })
  updateAvailability(
    @Param('id') id: string,
    @Body() body: UpdateSpaceAvailabilityDto,
  ) {
    return this.spaceService.updateAvailability(id, body);
  }

  @Get(':id/check-availability')
  @ApiOperation({ summary: 'Check whether a campus space is currently available' })
  checkAvailability(@Param('id') id: string) {
    return this.spaceService.checkAvailability(id);
  }
}
