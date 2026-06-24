import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  private readonly redis?: Redis;

  constructor() {
    const host = process.env.REDIS_HOST;

    if (host) {
      this.redis = new Redis({
        host,
        port: Number(process.env.REDIS_PORT) || 6379,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;

    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      const value = await this.redis.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.redis || ttlSeconds <= 0) return;

    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      return;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.redis) return;

    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      await this.redis.del(key);
    } catch {
      return;
    }
  }

  async onModuleDestroy() {
    await this.redis?.quit();
  }
}
