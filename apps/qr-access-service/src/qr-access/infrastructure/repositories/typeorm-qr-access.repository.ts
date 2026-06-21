import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrAccessCodeEntity } from '../entities/qr-access-code.entity';
import { QrAccessLogEntity } from '../entities/qr-access-log.entity';
import {
  CreateQrAccessLogRecord,
  CreateQrAccessRecord,
  QrAccessLogRecord,
  QrAccessRecord,
  QrAccessRepositoryPort,
} from '../../application/ports/qr-access-repository.port';
import { QrAccessStatus } from '../../domain/qr-access-status.enum';

@Injectable()
export class TypeOrmQrAccessRepository implements QrAccessRepositoryPort {
  constructor(
    @InjectRepository(QrAccessCodeEntity)
    private readonly codeRepository: Repository<QrAccessCodeEntity>,
    @InjectRepository(QrAccessLogEntity)
    private readonly logRepository: Repository<QrAccessLogEntity>,
  ) {}

  async create(data: CreateQrAccessRecord): Promise<QrAccessRecord> {
    const record = this.codeRepository.create(data);
    return this.codeRepository.save(record);
  }

  findAll(): Promise<QrAccessRecord[]> {
    return this.codeRepository.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string): Promise<QrAccessRecord | null> {
    return this.codeRepository.findOneBy({ id });
  }

  findByQrCode(qrCode: string): Promise<QrAccessRecord | null> {
    return this.codeRepository.findOneBy({ qrCode });
  }

  async updateStatus(id: string, status: QrAccessStatus): Promise<QrAccessRecord> {
    await this.codeRepository.update(id, { status });
    return (await this.findById(id)) as QrAccessRecord;
  }

  async createLog(data: CreateQrAccessLogRecord): Promise<QrAccessLogRecord> {
    const record = this.logRepository.create(data);
    return this.logRepository.save(record);
  }

  findLogs(): Promise<QrAccessLogRecord[]> {
    return this.logRepository.find({ order: { attemptDate: 'DESC' } });
  }
}
