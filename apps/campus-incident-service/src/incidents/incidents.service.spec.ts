import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IncidentsService } from './incidents.service';
import { Incident } from './entities/incident.entity';
import { RabbitmqPublisherService } from '../rabbitmq/rabbitmq-publisher.service';

describe('IncidentsService', () => {
  let service: IncidentsService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockRabbit = {
    publish: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        IncidentsService,

        {
          provide: getRepositoryToken(Incident),
          useValue: mockRepo,
        },

        {
          provide: RabbitmqPublisherService,
          useValue: mockRabbit,
        },
      ],
    }).compile();

    service = moduleRef.get(IncidentsService);
  });

  it('should create incident', async () => {
    mockRepo.create.mockReturnValue({ id: 1 });
    mockRepo.save.mockResolvedValue({ id: 1 });

    const result = await service.create({
      title: 'Test',
      description: 'desc',
      location: 'loc',
    });

    expect(result).toEqual({ id: 1 });
    expect(mockRabbit.publish).toHaveBeenCalled();
  });
});