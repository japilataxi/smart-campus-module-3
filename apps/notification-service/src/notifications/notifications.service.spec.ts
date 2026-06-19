import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  const repository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const redisService = {
    increment: jest.fn(),
    reset: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  };

  let service: NotificationsService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new NotificationsService(repository as any, redisService as any);
  });

  it('should find all notifications', async () => {
    repository.find.mockResolvedValue([]);

    const result = await service.findAll();

    expect(result).toEqual([]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should create notification from event and increment Redis counter', async () => {
    const notification = {
      id: '1',
      userId: 'user-1',
      title: 'Test',
      message: 'Message',
      type: 'INFO',
      sourceService: 'test-service',
      eventType: 'TestEvent',
      read: false,
    };

    repository.create.mockReturnValue(notification);
    repository.save.mockResolvedValue(notification);
    redisService.increment.mockResolvedValue(1);

    const result = await service.createFromEvent(notification);

    expect(result).toEqual(notification);
    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
    expect(redisService.increment).toHaveBeenCalledWith(
      'notification:unread:user-1',
    );
  });

  it('should mark notification as read', async () => {
    const notification = {
      id: '1',
      read: false,
    };

    repository.findOne.mockResolvedValue(notification);
    repository.save.mockResolvedValue({ ...notification, read: true });

    const result = await service.markAsRead('1');

    expect(result.read).toBe(true);
    expect(repository.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException when notification does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.markAsRead('invalid-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});