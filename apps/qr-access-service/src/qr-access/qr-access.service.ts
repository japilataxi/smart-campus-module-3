import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

import { GenerateQrAccessDto } from './dto/generate-qr-access.dto';
import { ValidateQrAccessDto } from './dto/validate-qr-access.dto';
import { QrAccessLog } from './entities/qr-access-log.entity';

@Injectable()
export class QrAccessService {
  constructor(
    @InjectRepository(QrAccessLog)
    private readonly qrAccessRepository: Repository<QrAccessLog>,
  ) {}

  async generate(dto: GenerateQrAccessDto): Promise<QrAccessLog> {
    const expiresAt = new Date(Date.now() + dto.expiresInMinutes * 60_000);
    const qrAccessLog = this.qrAccessRepository.create({
      userId: dto.userId,
      accessPoint: dto.accessPoint,
      expiresAt,
      qrCode: this.createQrCode(),
    });

    return this.qrAccessRepository.save(qrAccessLog);
  }

  async validate(dto: ValidateQrAccessDto): Promise<QrAccessLog> {
    const qrAccessLog = await this.qrAccessRepository.findOne({
      where: { qrCode: dto.qrCode },
    });

    if (!qrAccessLog) {
      throw new NotFoundException('QR access record was not found.');
    }

    if (qrAccessLog.accessPoint !== dto.accessPoint) {
      throw new UnprocessableEntityException('QR access point does not match.');
    }

    if (qrAccessLog.validated) {
      throw new ConflictException('QR access record has already been validated.');
    }

    if (qrAccessLog.expiresAt.getTime() < Date.now()) {
      throw new UnprocessableEntityException('QR access record has expired.');
    }

    qrAccessLog.validated = true;
    qrAccessLog.validatedAt = new Date();

    return this.qrAccessRepository.save(qrAccessLog);
  }

  async findLogs(): Promise<QrAccessLog[]> {
    return this.qrAccessRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<QrAccessLog> {
    const qrAccessLog = await this.qrAccessRepository.findOne({ where: { id } });

    if (!qrAccessLog) {
      throw new NotFoundException('QR access record was not found.');
    }

    return qrAccessLog;
  }

  async remove(id: string): Promise<void> {
    const qrAccessLog = await this.findById(id);
    await this.qrAccessRepository.softRemove(qrAccessLog);
  }

  private createQrCode(): string {
    return `QR-${randomUUID()}`;
  }
}

