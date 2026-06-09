import { QrAccessLog } from '../entities/qr-access-log.entity';

export const QR_ACCESS_CACHE = Symbol('QR_ACCESS_CACHE');

export interface QrAccessCachePort {
  getActiveCode(qrCode: string): Promise<QrAccessLog | null>;
  setActiveCode(qrAccessLog: QrAccessLog): Promise<void>;
  deleteCode(qrCode: string): Promise<void>;
}
