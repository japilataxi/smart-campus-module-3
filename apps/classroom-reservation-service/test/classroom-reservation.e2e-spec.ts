import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';

import { AppModule } from '../src/app.module';

describe('Classroom Reservation Service E2E', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let adminToken: string;
  let studentToken: string;
  let classroomId: string;
  let reservationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    jwtService = moduleFixture.get<JwtService>(JwtService);

    adminToken = jwtService.sign({
      sub: '11111111-1111-1111-1111-111111111111',
      email: 'admin@smartcampus.edu.ec',
      role: 'ADMIN',
    });

    studentToken = jwtService.sign({
      sub: '22222222-2222-2222-2222-222222222222',
      email: 'student@smartcampus.edu.ec',
      role: 'STUDENT',
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reject unauthenticated requests', async () => {
    await request(app.getHttpServer()).get('/classrooms').expect(401);
  });

  it('should create a classroom as ADMIN', async () => {
    const response = await request(app.getHttpServer())
      .post('/classrooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Room A101',
        building: 'Engineering Building',
        floor: 1,
        capacity: 40,
        type: 'LAB',
        status: 'AVAILABLE',
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('Room A101');

    classroomId = response.body.id;
  });

  it('should forbid classroom creation as STUDENT', async () => {
    await request(app.getHttpServer())
      .post('/classrooms')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        name: 'Room B101',
        building: 'Engineering Building',
        floor: 1,
        capacity: 30,
        type: 'CLASSROOM',
        status: 'AVAILABLE',
      })
      .expect(403);
  });

  it('should get classrooms as ADMIN', async () => {
    const response = await request(app.getHttpServer())
      .get('/classrooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a reservation', async () => {
    const response = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        classroomId,
        userId: '22222222-2222-2222-2222-222222222222',
        reservationDate: '2026-06-10',
        startTime: '08:00',
        endTime: '10:00',
        purpose: 'Distributed Programming class',
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe('PENDING');

    reservationId = response.body.id;
  });

  it('should reject reservation conflict', async () => {
    await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        classroomId,
        userId: '22222222-2222-2222-2222-222222222222',
        reservationDate: '2026-06-10',
        startTime: '09:00',
        endTime: '11:00',
        purpose: 'Conflict reservation',
      })
      .expect(400);
  });

  it('should approve a reservation as ADMIN', async () => {
    const response = await request(app.getHttpServer())
      .post(`/reservations/${reservationId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);

    expect(response.body.status).toBe('APPROVED');
  });
});