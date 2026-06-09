import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async log(data: {
    action: string;
    userId?: string;
    email?: string;
    ipAddress?: string;
  }): Promise<void> {
    const auditLog = this.auditRepository.create(data);
    await this.auditRepository.save(auditLog);
  }
}