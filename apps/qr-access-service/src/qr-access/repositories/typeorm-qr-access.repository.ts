import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QrAccessLog } from '../entities/qr-access-log.entity';
import { QrAccessRepositoryPort } from '../ports/qr-access-repository.port';

@Injectable()
export class TypeOrmQrAccessRepository implements QrAccessRepositoryPort {
  constructor(
    @InjectRepository(QrAccessLog)
    private readonly repository: Repository<QrAccessLog>,
  ) {}

  create(data: Partial<QrAccessLog>): QrAccessLog {
    return this.repository.create(data);
  }

  save(qrAccessLog: QrAccessLog): Promise<QrAccessLog> {
    return this.repository.save(qrAccessLog);
  }

  findByQrCode(qrCode: string): Promise<QrAccessLog | null> {
    return this.repository.findOne({ where: { qrCode } });
  }

  findById(id: string): Promise<QrAccessLog | null> {
    return this.repository.findOne({ where: { id } });
  }

  findLogs(): Promise<QrAccessLog[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  softRemove(qrAccessLog: QrAccessLog): Promise<QrAccessLog> {
    return this.repository.softRemove(qrAccessLog);
  }
}
