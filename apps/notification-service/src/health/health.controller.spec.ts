import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('should return service status', () => {
    const controller = new HealthController();

    expect(controller.check()).toMatchObject({
      service: 'notification-service',
      status: 'ok',
    });
  });
});