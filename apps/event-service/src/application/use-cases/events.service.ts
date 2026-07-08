import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCampusEventDto } from '../dto/create-campus-event.dto';
import { UpdateCampusEventDto } from '../dto/update-campus-event.dto';
import { CampusEvent } from '../../domain/entities/campus-event.entity';
import { EventRegistration } from '../../domain/entities/event-registration.entity';
import { CampusEventStatus } from '../../domain/enums/campus-event-status.enum';
import { EventRegistrationStatus } from '../../domain/enums/event-registration-status.enum';
import { KafkaProducerService } from '../../infrastructure/kafka/kafka-producer.service';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(CampusEvent)
    private readonly eventRepository: Repository<CampusEvent>,

    @InjectRepository(EventRegistration)
    private readonly registrationRepository: Repository<EventRegistration>,

    private readonly kafkaProducerService: KafkaProducerService,
    private readonly metricsService: MetricsService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateCampusEventDto): Promise<CampusEvent> {
    if (new Date(dto.endDate) <= new Date(dto.startDate)) {
      throw new BadRequestException('endDate must be after startDate');
    }

    const event = this.eventRepository.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      status: CampusEventStatus.ACTIVE,
    });

    const savedEvent = await this.eventRepository.save(event);

    await this.cacheManager.del('events:active');

    await this.kafkaProducerService.emit('CampusEventCreated', savedEvent);
    this.metricsService.incrementCampusEventsCreated();
    this.metricsService.incrementKafkaEventsPublished();

    return savedEvent;
  }

  async findAll(): Promise<CampusEvent[]> {
    const cacheKey = 'events:active';

    const cached = await this.cacheManager.get<CampusEvent[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const events = await this.eventRepository.find({
      where: {
        status: CampusEventStatus.ACTIVE,
      },
      order: {
        startDate: 'ASC',
      },
    });

    await this.cacheManager.set(cacheKey, events, 60 * 1000);

    return events;
  }

  async findOne(id: string): Promise<CampusEvent> {
    const cacheKey = `events:details:${id}`;

    const cached = await this.cacheManager.get<CampusEvent>(cacheKey);

    if (cached) {
      return cached;
    }

    const event = await this.eventRepository.findOne({
      where: { id },
      relations: {
        registrations: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Campus event not found');
    }

    await this.cacheManager.set(cacheKey, event, 60 * 1000);

    return event;
  }

  async update(id: string, dto: UpdateCampusEventDto): Promise<CampusEvent> {
    const event = await this.findOne(id);

    const nextStartDate = dto.startDate
      ? new Date(dto.startDate)
      : event.startDate;

    const nextEndDate = dto.endDate ? new Date(dto.endDate) : event.endDate;

    if (nextEndDate <= nextStartDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    Object.assign(event, {
      ...dto,
      startDate: nextStartDate,
      endDate: nextEndDate,
    });

    const updatedEvent = await this.eventRepository.save(event);

    await this.clearEventCache(id);

    await this.kafkaProducerService.emit('CampusEventUpdated', updatedEvent);
    this.metricsService.incrementKafkaEventsPublished();

    return updatedEvent;
  }

  async cancel(id: string): Promise<CampusEvent> {
    const event = await this.findOne(id);

    if (event.status === CampusEventStatus.CANCELLED) {
      throw new ConflictException('Campus event is already cancelled');
    }

    event.status = CampusEventStatus.CANCELLED;

    const cancelledEvent = await this.eventRepository.save(event);

    await this.clearEventCache(id);

    await this.kafkaProducerService.emit('CampusEventCancelled', cancelledEvent);
    this.metricsService.incrementCampusEventsCancelled();
    this.metricsService.incrementKafkaEventsPublished();

    return cancelledEvent;
  }

  async register(eventId: string, userId: string): Promise<EventRegistration> {
    const event = await this.findOne(eventId);

    if (event.status !== CampusEventStatus.ACTIVE) {
      throw new BadRequestException('Only active events allow registration');
    }

    if (event.endDate <= new Date()) {
      throw new BadRequestException('Cannot register for a finished event');
    }

    const existingRegistration = await this.registrationRepository.findOne({
      where: {
        eventId,
        userId,
        status: EventRegistrationStatus.REGISTERED,
      },
    });

    if (existingRegistration) {
      throw new ConflictException('User is already registered for this event');
    }

    const registeredCount = await this.registrationRepository.count({
      where: {
        eventId,
        status: EventRegistrationStatus.REGISTERED,
      },
    });

    if (registeredCount >= event.capacity) {
      throw new ConflictException('Event capacity has been reached');
    }

    const registration = this.registrationRepository.create({
      eventId,
      userId,
      status: EventRegistrationStatus.REGISTERED,
      cancelledAt: null,
    });

    const savedRegistration =
      await this.registrationRepository.save(registration);

    await this.clearEventCache(eventId);

    await this.kafkaProducerService.emit('CampusEventRegistrationCreated', {
      event,
      registration: savedRegistration,
      availableCapacity: event.capacity - registeredCount - 1,
    });

    this.metricsService.incrementEventRegistrationsCreated();
    this.metricsService.incrementKafkaEventsPublished();

    return savedRegistration;
  }

  async cancelRegistration(
    eventId: string,
    userId: string,
  ): Promise<EventRegistration> {
    await this.findOne(eventId);

    const registration = await this.registrationRepository.findOne({
      where: {
        eventId,
        userId,
        status: EventRegistrationStatus.REGISTERED,
      },
    });

    if (!registration) {
      throw new NotFoundException('Active registration not found');
    }

    registration.status = EventRegistrationStatus.CANCELLED;
    registration.cancelledAt = new Date();

    const cancelledRegistration =
      await this.registrationRepository.save(registration);

    await this.clearEventCache(eventId);

    await this.kafkaProducerService.emit('CampusEventRegistrationCancelled', {
      eventId,
      userId,
      registration: cancelledRegistration,
    });

    this.metricsService.incrementKafkaEventsPublished();

    return cancelledRegistration;
  }

  async getRegistrations(eventId: string): Promise<EventRegistration[]> {
    await this.findOne(eventId);

    return this.registrationRepository.find({
      where: {
        eventId,
        status: EventRegistrationStatus.REGISTERED,
      },
      order: {
        registeredAt: 'DESC',
      },
    });
  }

  private async clearEventCache(eventId: string): Promise<void> {
    await this.cacheManager.del('events:active');
    await this.cacheManager.del(`events:details:${eventId}`);
  }
}