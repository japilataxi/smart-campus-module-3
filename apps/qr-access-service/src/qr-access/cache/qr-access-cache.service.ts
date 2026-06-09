import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

import { QrAccessLog } from '../entities/qr-access-log.entity';
import { QrAccessStatus } from '../enums/qr-access-status.enum';
import { QrAccessCachePort } from '../ports/qr-access-cache.port';

@Injectable()
export class QrAccessCacheService implements QrAccessCachePort, OnModuleDestroy {
  private readonly logger = new Logger(QrAccessCacheService.name);
  private readonly redis?: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl) {
      this.redis = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });
    }
  }

  async getActiveCode(qrCode: string): Promise<QrAccessLog | null> {
    if (!this.redis) return null;

    try {
      await this.ensureConnected();
      const cached = await this.redis.get(this.key(qrCode));
      if (!cached) return null;

      const parsed = JSON.parse(cached) as QrAccessLog;
      return {
        ...parsed,
        expiresAt: new Date(parsed.expiresAt),
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
        validatedAt: parsed.validatedAt ? new Date(parsed.validatedAt) : null,
        lastAttemptAt: parsed.lastAttemptAt ? new Date(parsed.lastAttemptAt) : null,
      } as QrAccessLog;
    } catch (error) {
      this.logger.warn(`Redis read skipped: ${(error as Error).message}`);
      return null;
    }
  }

  async setActiveCode(qrAccessLog: QrAccessLog): Promise<void> {
    if (!this.redis || qrAccessLog.status !== QrAccessStatus.ACTIVE) return;

    const ttl = Math.max(1, Math.floor((qrAccessLog.expiresAt.getTime() - Date.now()) / 1000));

    try {
      await this.ensureConnected();
      await this.redis.set(this.key(qrAccessLog.qrCode), JSON.stringify(qrAccessLog), 'EX', ttl);
    } catch (error) {
      this.logger.warn(`Redis write skipped: ${(error as Error).message}`);
    }
  }

  async deleteCode(qrCode: string): Promise<void> {
    if (!this.redis) return;

    try {
      await this.ensureConnected();
      await this.redis.del(this.key(qrCode));
    } catch (error) {
      this.logger.warn(`Redis delete skipped: ${(error as Error).message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis?.quit();
  }

  private key(qrCode: string): string {
    return `qr-access:active:${qrCode}`;
  }

  private async ensureConnected(): Promise<void> {
    if (!this.redis || this.redis.status === 'ready' || this.redis.status === 'connecting') return;
    await this.redis.connect();
  }
}
