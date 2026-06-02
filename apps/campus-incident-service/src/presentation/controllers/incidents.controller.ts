import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Incident } from '../../domain/entities/incident.entity';
import { IncidentPriority } from '../../domain/enums/incident-priority.enum';
import { IncidentStatus } from '../../domain/enums/incident-status.enum';

@ApiTags('Campus Incidents')
@Controller('incidents')
export class IncidentsController {
  private incidents: Incident[] = [];
  private currentId = 1;

  @Post()
  @ApiOperation({ summary: 'Create a campus incident report' })
  create(@Body() body: Partial<Incident>): Incident {
    const incident: Incident = {
      id: this.currentId++,
      title: body.title ?? '',
      description: body.description ?? '',
      location: body.location ?? '',
      category: body.category ?? 'GENERAL',
      priority: body.priority ?? IncidentPriority.MEDIUM,
      status: IncidentStatus.OPEN,
      reportedBy: body.reportedBy ?? 'anonymous',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.incidents.push(incident);
    return incident;
  }

  @Get()
  @ApiOperation({ summary: 'List campus incidents' })
  findAll(): Incident[] {
    return this.incidents;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a campus incident by id' })
  findOne(@Param('id') id: string): Incident | { message: string } {
    const incident = this.incidents.find((item) => item.id === Number(id));

    if (!incident) {
      return { message: 'Incident not found' };
    }

    return incident;
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update campus incident status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: IncidentStatus,
  ): Incident | { message: string } {
    const incident = this.incidents.find((item) => item.id === Number(id));

    if (!incident) {
      return { message: 'Incident not found' };
    }

    incident.status = status;
    incident.updatedAt = new Date();

    return incident;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campus incident' })
  remove(@Param('id') id: string): { message: string } {
    this.incidents = this.incidents.filter((item) => item.id !== Number(id));

    return { message: 'Incident deleted successfully' };
  }
}