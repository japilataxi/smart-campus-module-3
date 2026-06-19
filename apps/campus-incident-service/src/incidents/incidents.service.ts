import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RabbitmqPublisherService } from '../rabbitmq/rabbitmq-publisher.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { Incident } from './entities/incident.entity';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
    private readonly rabbitmqPublisher: RabbitmqPublisherService,
  ) {}

  async create(dto: CreateIncidentDto) {
    const incident = this.incidentRepository.create(dto);
    const savedIncident = await this.incidentRepository.save(incident);

    await this.rabbitmqPublisher.publish('incident.created', {
      userId: 'admin',
      title: 'New campus incident',
      message: `A new incident was created: ${savedIncident.title}`,
      type: 'WARNING',
      sourceService: 'campus-incident-service',
      eventType: 'IncidentCreated',
      incidentId: savedIncident.id,
      payload: savedIncident,
    });

    return savedIncident;
  }

  findAll() {
    return this.incidentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const incident = await this.incidentRepository.findOneBy({ id });

    if (!incident) {
      throw new NotFoundException(`Incident with id ${id} not found`);
    }

    return incident;
  }

  async update(id: number, dto: UpdateIncidentDto) {
    const incident = await this.findOne(id);

    Object.assign(incident, dto);

    const updatedIncident = await this.incidentRepository.save(incident);

    await this.rabbitmqPublisher.publish('incident.status.updated', {
      userId: 'admin',
      title: 'Campus incident updated',
      message: `Incident ${updatedIncident.id} was updated`,
      type: 'INFO',
      sourceService: 'campus-incident-service',
      eventType: 'IncidentStatusUpdated',
      incidentId: updatedIncident.id,
      payload: updatedIncident,
    });

    return updatedIncident;
  }

  async remove(id: number) {
    const incident = await this.findOne(id);
    await this.incidentRepository.remove(incident);

    return {
      message: `Incident with id ${id} deleted successfully`,
    };
  }
}