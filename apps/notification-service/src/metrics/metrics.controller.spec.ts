import { MetricsController } from './metrics.controller';

describe('MetricsController', () => {
  it('should return prometheus metrics', async () => {
    const metricsService = {
      getMetrics: jest.fn().mockResolvedValue(
        [
          'notification_service_status 1',
          'notification_service_notifications_created_total 10',
          'notification_service_rabbitmq_messages_consumed_total 10',
        ].join('\n'),
      ),
    };

    const controller = new MetricsController(metricsService as any);

    const result = await controller.getMetrics();

    expect(result).toContain('notification_service_status');
    expect(result).toContain('notification_service_notifications_created_total');
    expect(result).toContain('notification_service_rabbitmq_messages_consumed_total');
  });
});