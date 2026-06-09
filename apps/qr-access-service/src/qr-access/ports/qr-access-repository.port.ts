import { QrAccessLog } from '../entities/qr-access-log.entity';

export const QR_ACCESS_REPOSITORY = Symbol('QR_ACCESS_REPOSITORY');

export interface QrAccessRepositoryPort {
  create(data: Partial<QrAccessLog>): QrAccessLog;
  save(qrAccessLog: QrAccessLog): Promise<QrAccessLog>;
  findByQrCode(qrCode: string): Promise<QrAccessLog | null>;
  findById(id: string): Promise<QrAccessLog | null>;
  findLogs(): Promise<QrAccessLog[]>;
  softRemove(qrAccessLog: QrAccessLog): Promise<QrAccessLog>;
}
