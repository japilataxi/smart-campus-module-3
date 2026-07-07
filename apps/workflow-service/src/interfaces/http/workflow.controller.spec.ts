import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { WorkflowService } from '../../application/use-cases/workflow.service';
import { WorkflowController } from './workflow.controller';

describe('WorkflowController', () => {
  it('lists executions', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WorkflowController],
      providers: [
        { provide: JwtService, useValue: { verify: jest.fn() } },
        Reflector,
        {
          provide: WorkflowService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findById: jest.fn(),
            trigger: jest.fn(),
            triggerIncidentCreated: jest.fn(),
            triggerUserRegistered: jest.fn(),
            triggerLibraryLoanCreated: jest.fn(),
            triggerCriticalNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(WorkflowController);
    await expect(controller.findAll({ limit: 10 })).resolves.toEqual([]);
  });
});
