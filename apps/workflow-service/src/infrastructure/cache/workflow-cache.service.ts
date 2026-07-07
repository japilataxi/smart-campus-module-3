import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class WorkflowCacheService implements OnModuleDestroy {
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
    if (!this.redis) return;
    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      return;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.redis) return false;
    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      return (await this.redis.exists(key)) === 1;
    } catch {
      return false;
    }
  }

  async increment(key: string, ttlSeconds: number): Promise<number> {
    if (!this.redis) return 0;
    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      const value = await this.redis.incr(key);
      await this.redis.expire(key, ttlSeconds);
      return value;
    } catch {
      return 0;
    }
  }

  async onModuleDestroy() {
    await this.redis?.quit();
  }
}
