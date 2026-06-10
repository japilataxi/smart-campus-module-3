import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  create(dto: CreateIncidentDto) {
    const incident = this.incidentRepository.create(dto);
    return this.incidentRepository.save(incident);
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
    return this.incidentRepository.save(incident);
  }

  async remove(id: number) {
    const incident = await this.findOne(id);
    await this.incidentRepository.remove(incident);

    return {
      message: `Incident with id ${id} deleted successfully`,
    };
  }
}