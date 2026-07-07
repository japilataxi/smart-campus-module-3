import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { FilterAnnouncementsDto } from './dto/filter-announcements.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@ApiTags('Announcements')
@ApiBearerAuth()
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new announcement' })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.create(createAnnouncementDto);
  }

  @Get()
  @ApiOperation({ summary: 'List announcements with filters and pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() filters: FilterAnnouncementsDto) {
    return this.announcementsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get announcement detail by ID' })
  @ApiParam({ name: 'id', description: 'Announcement UUID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update announcement by ID' })
  @ApiParam({ name: 'id', description: 'Announcement UUID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(id, updateAnnouncementDto);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Publish announcement by ID' })
  @ApiParam({ name: 'id', description: 'Announcement UUID' })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.announcementsService.publish(id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive announcement by ID' })
  @ApiParam({ name: 'id', description: 'Announcement UUID' })
  archive(@Param('id', ParseUUIDPipe) id: string) {
    return this.announcementsService.archive(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete announcement by ID' })
  @ApiParam({ name: 'id', description: 'Announcement UUID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.announcementsService.remove(id);
  }
}