import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Inject,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { GenerateQrAccessDto } from './dto/generate-qr-access.dto';
import { ValidateQrAccessDto } from './dto/validate-qr-access.dto';
import { QrAccessLog } from './entities/qr-access-log.entity';
import { QrAccessStatus } from './enums/qr-access-status.enum';
import { QR_ACCESS_CACHE, QrAccessCachePort } from './ports/qr-access-cache.port';
import {
  QR_ACCESS_REPOSITORY,
  QrAccessRepositoryPort,
} from './ports/qr-access-repository.port';

@Injectable()
export class QrAccessService {
  constructor(
    @Inject(QR_ACCESS_REPOSITORY)
    private readonly qrAccessRepository: QrAccessRepositoryPort,
    @Inject(QR_ACCESS_CACHE)
    private readonly cache: QrAccessCachePort,
  ) {}

  async generate(dto: GenerateQrAccessDto): Promise<QrAccessLog> {
    const expiresAt = new Date(Date.now() + dto.expiresInMinutes * 60_000);
    const qrAccessLog = this.qrAccessRepository.create({
      userId: dto.userId,
      accessPoint: dto.accessPoint,
      expiresAt,
      qrCode: this.createQrCode(),
      status: QrAccessStatus.ACTIVE,
      attemptsCount: 0,
    });

    const saved = await this.qrAccessRepository.save(qrAccessLog);
    await this.cache.setActiveCode(saved);
    return saved;
  }

  async validate(dto: ValidateQrAccessDto): Promise<QrAccessLog> {
    const cached = await this.cache.getActiveCode(dto.qrCode);
    const qrAccessLog =
      cached ??
      (await this.qrAccessRepository.findByQrCode(dto.qrCode));

    if (!qrAccessLog) {
      throw new NotFoundException('QR access record was not found.');
    }

    qrAccessLog.attemptsCount += 1;
    qrAccessLog.lastAttemptAt = new Date();

    if (qrAccessLog.accessPoint !== dto.accessPoint) {
      qrAccessLog.lastDenialReason = 'QR access point does not match.';
      await this.qrAccessRepository.save(qrAccessLog);
      throw new UnprocessableEntityException('QR access point does not match.');
    }

    if (qrAccessLog.status === QrAccessStatus.USED) {
      qrAccessLog.lastDenialReason = 'QR access record has already been validated.';
      await this.qrAccessRepository.save(qrAccessLog);
      throw new ConflictException('QR access record has already been validated.');
    }

    if (qrAccessLog.status === QrAccessStatus.REVOKED) {
      qrAccessLog.lastDenialReason = 'QR access record has been revoked.';
      await this.qrAccessRepository.save(qrAccessLog);
      throw new UnprocessableEntityException('QR access record has been revoked.');
    }

    if (qrAccessLog.expiresAt.getTime() < Date.now()) {
      qrAccessLog.status = QrAccessStatus.EXPIRED;
      qrAccessLog.lastDenialReason = 'QR access record has expired.';
      await this.qrAccessRepository.save(qrAccessLog);
      await this.cache.deleteCode(qrAccessLog.qrCode);
      throw new UnprocessableEntityException('QR access record has expired.');
    }

    qrAccessLog.status = QrAccessStatus.USED;
    qrAccessLog.validatedAt = new Date();
    qrAccessLog.lastDenialReason = null;

    const saved = await this.qrAccessRepository.save(qrAccessLog);
    await this.cache.deleteCode(saved.qrCode);
    return saved;
  }

  async findLogs(): Promise<QrAccessLog[]> {
    return this.qrAccessRepository.findLogs();
  }

  async findById(id: string): Promise<QrAccessLog> {
    const qrAccessLog = await this.qrAccessRepository.findById(id);

    if (!qrAccessLog) {
      throw new NotFoundException('QR access record was not found.');
    }

    return qrAccessLog;
  }

  async remove(id: string): Promise<void> {
    const qrAccessLog = await this.findById(id);
    await this.qrAccessRepository.softRemove(qrAccessLog);
  }

  async revoke(id: string, reason = 'QR access record was revoked.'): Promise<QrAccessLog> {
    const qrAccessLog = await this.findById(id);
    qrAccessLog.status = QrAccessStatus.REVOKED;
    qrAccessLog.lastDenialReason = reason;
    qrAccessLog.lastAttemptAt = new Date();

    const saved = await this.qrAccessRepository.save(qrAccessLog);
    await this.cache.deleteCode(saved.qrCode);
    return saved;
  }

  private createQrCode(): string {
    return `QR-${randomUUID()}`;
  }
}

