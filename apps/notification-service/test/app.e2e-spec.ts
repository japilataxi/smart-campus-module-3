import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { HealthModule } from './../src/health/health.module';
import { MetricsController } from './../src/metrics/metrics.controller';
import { MetricsService } from './../src/metrics/metrics.service';

@Module({
  controllers: [MetricsController],
  providers: [
    {
      provide: MetricsService,
      useValue: {
        getMetrics: jest.fn().mockResolvedValue(
          [
            '# HELP notification_service_status Notification service status',
            '# TYPE notification_service_status gauge',
            'notification_service_status 1',
          ].join('\n'),
        ),
      },
    },
  ],
})
class TestMetricsModule {}

describe('Notification Service (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule, TestMetricsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((response) => {
        expect(response.body.service).toBe('notification-service');
        expect(response.body.status).toBe('ok');
      });
  });

  it('/metrics (GET)', () => {
    return request(app.getHttpServer())
      .get('/metrics')
      .expect(200)
      .expect((response) => {
        expect(response.text).toContain('notification_service_status');
      });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});