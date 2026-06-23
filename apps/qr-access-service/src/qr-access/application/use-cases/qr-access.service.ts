import { randomUUID } from 'crypto';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQrAccessDto } from '../dto/create-qr-access.dto';
import { ValidateQrAccessDto } from '../dto/validate-qr-access.dto';
import { QR_ACCESS_REPOSITORY } from '../ports/qr-access-repository.port';
import type {
  QrAccessLogRecord,
  QrAccessRecord,
  QrAccessRepositoryPort,
} from '../ports/qr-access-repository.port';
import { QrAccessStatus } from '../../domain/qr-access-status.enum';
import { RedisCacheService } from '../../../common/cache/redis-cache.service';
import { StructuredLogger } from '../../../common/logging/structured-logger.service';

export type QrValidationResult = {
  granted: boolean;
  status: QrAccessStatus;
  message: string;
  qrAccess?: QrAccessRecord;
};

@Injectable()
export class QrAccessService {
  constructor(
    @Inject(QR_ACCESS_REPOSITORY)
    private readonly repository: QrAccessRepositoryPort,
    private readonly cache: RedisCacheService,
    private readonly logger: StructuredLogger,
  ) {}

  async generate(dto: CreateQrAccessDto): Promise<QrAccessRecord> {
    const expirationDate = new Date(dto.expirationDate);
    const qrCode = `QR-${randomUUID()}`;

    const record = await this.repository.create({
      userId: dto.userId,
      qrCode,
      accessType: dto.accessType,
      location: dto.location,
      status: QrAccessStatus.ACTIVE,
      expirationDate,
    });

    await this.cacheActiveCode(record);
    this.logger.log({ action: 'qr_access_generated', id: record.id, userId: record.userId }, 'QrAccessService');

    return record;
  }

  async findAll(): Promise<QrAccessRecord[]> {
    const records = await this.repository.findAll();
    return Promise.all(records.map((record) => this.expireIfNeeded(record)));
  }

  async findLogs(): Promise<QrAccessLogRecord[]> {
    return this.repository.findLogs();
  }

  async revoke(id: string): Promise<QrAccessRecord> {
    const record = await this.repository.findById(id);

    if (!record) {
      throw new NotFoundException(`QR access code with id ${id} not found`);
    }

    const revoked = await this.repository.updateStatus(id, QrAccessStatus.REVOKED);
    await this.cache.del(this.cacheKey(record.qrCode));
    await this.repository.createLog({
      qrAccessCodeId: record.id,
      userId: record.userId,
      qrCode: record.qrCode,
      status: QrAccessStatus.REVOKED,
      location: record.location,
      message: 'QR access code revoked',
    });

    this.logger.warn({ action: 'qr_access_revoked', id, userId: record.userId }, 'QrAccessService');
    return revoked;
  }

  async validate(dto: ValidateQrAccessDto): Promise<QrValidationResult> {
  const qrCode = dto.qrCode?.trim();

  if (!qrCode) {
    throw new BadRequestException('QR code is required');
  }

  const cached = await this.cache.get<QrAccessRecord>(this.cacheKey(qrCode));
  const record = cached || (await this.repository.findByQrCode(qrCode));

  if (!record) {
    await this.repository.createLog({
      qrAccessCodeId: null,
      userId: null,
      qrCode,
      status: QrAccessStatus.REVOKED,
      location: dto.location?.trim() || null,
      message: 'Access denied: QR code not found',
    });

    return {
      granted: false,
      status: QrAccessStatus.REVOKED,
      message: 'Access denied',
    };
  }

  const freshRecord = await this.expireIfNeeded(record);
  const result = await this.evaluateValidation(freshRecord, dto.location?.trim());

  await this.repository.createLog({
    qrAccessCodeId: freshRecord.id || null,
    userId: freshRecord.userId || null,
    qrCode: freshRecord.qrCode,
    status: result.status,
    location: dto.location?.trim() || freshRecord.location || null,
    message: result.message,
  });

  this.logger.log(
    {
      action: result.granted ? 'qr_access_validated' : 'qr_access_denied',
      id: freshRecord.id,
      userId: freshRecord.userId,
      status: result.status,
    },
    'QrAccessService',
  );

  return result;
}

  private async evaluateValidation(record: QrAccessRecord, location?: string): Promise<QrValidationResult> {
    if (record.status === QrAccessStatus.EXPIRED) {
      await this.cache.del(this.cacheKey(record.qrCode));
      return { granted: false, status: QrAccessStatus.EXPIRED, message: 'QR expired', qrAccess: record };
    }

    if (record.status === QrAccessStatus.REVOKED) {
      await this.cache.del(this.cacheKey(record.qrCode));
      return { granted: false, status: QrAccessStatus.REVOKED, message: 'QR revoked', qrAccess: record };
    }

    if (record.status === QrAccessStatus.USED) {
      await this.cache.del(this.cacheKey(record.qrCode));
      return { granted: false, status: QrAccessStatus.USED, message: 'QR already used', qrAccess: record };
    }

    const used = await this.repository.updateStatus(record.id, QrAccessStatus.USED);
    await this.cache.del(this.cacheKey(record.qrCode));

    return {
      granted: true,
      status: QrAccessStatus.USED,
      message: `Access granted${location ? ` at ${location}` : ''}`,
      qrAccess: used,
    };
  }

  private async expireIfNeeded(record: QrAccessRecord): Promise<QrAccessRecord> {
  const expirationDate = new Date(record.expirationDate);

  if (record.status === QrAccessStatus.ACTIVE && expirationDate.getTime() <= Date.now()) {
    const expired = await this.repository.updateStatus(record.id, QrAccessStatus.EXPIRED);
    await this.cache.del(this.cacheKey(record.qrCode));
    return expired;
  }

  return {
    ...record,
    expirationDate,
  };
}

  private async cacheActiveCode(record: QrAccessRecord): Promise<void> {
  const expirationDate = new Date(record.expirationDate);
  const ttlSeconds = Math.floor((expirationDate.getTime() - Date.now()) / 1000);

  if (record.status === QrAccessStatus.ACTIVE && ttlSeconds > 0) {
    await this.cache.set(this.cacheKey(record.qrCode), record, ttlSeconds);
  }
}

  private cacheKey(qrCode: string): string {
    return `qr-access:active:${qrCode}`;
  }
}
