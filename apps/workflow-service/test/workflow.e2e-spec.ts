import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { WorkflowService } from '../src/application/use-cases/workflow.service';
import { WorkflowController } from '../src/interfaces/http/workflow.controller';

const workflowServiceMock = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue({ id: 'execution-1' }),
  trigger: jest.fn(),
  triggerIncidentCreated: jest.fn().mockResolvedValue({ id: 'execution-1', status: 'SUCCESS' }),
  triggerUserRegistered: jest.fn(),
  triggerLibraryLoanCreated: jest.fn(),
  triggerCriticalNotification: jest.fn(),
};

describe('WorkflowController (e2e)', () => {
  let app: INestApplication | undefined;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WorkflowController],
      providers: [
        { provide: JwtService, useValue: { verify: jest.fn() } },
        Reflector,
        { provide: WorkflowService, useValue: workflowServiceMock },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('/workflows/executions (GET)', () => {
    return request(app!.getHttpServer()).get('/workflows/executions').expect(200).expect([]);
  });

  it('/workflows/incident-created (POST)', () => {
    return request(app!.getHttpServer())
      .post('/workflows/incident-created')
      .send({ id: 'incident-1', payload: { title: 'Broken door' } })
      .expect(201)
      .expect((response) => {
        expect(response.body.status).toBe('SUCCESS');
      });
  });
});
