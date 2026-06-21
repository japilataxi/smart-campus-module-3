import { QrAccessStatus } from '../../domain/qr-access-status.enum';

export type QrAccessRecord = {
  id: string;
  userId: string;
  qrCode: string;
  accessType: string;
  location: string;
  status: QrAccessStatus;
  expirationDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type QrAccessLogRecord = {
  id: string;
  qrAccessCodeId: string | null;
  userId: string | null;
  qrCode: string;
  status: QrAccessStatus;
  location: string | null;
  message: string;
  attemptDate: Date;
};

export type CreateQrAccessRecord = {
  userId: string;
  qrCode: string;
  accessType: string;
  location: string;
  status: QrAccessStatus;
  expirationDate: Date;
};

export type CreateQrAccessLogRecord = {
  qrAccessCodeId: string | null;
  userId: string | null;
  qrCode: string;
  status: QrAccessStatus;
  location: string | null;
  message: string;
};

export interface QrAccessRepositoryPort {
  create(data: CreateQrAccessRecord): Promise<QrAccessRecord>;
  findAll(): Promise<QrAccessRecord[]>;
  findById(id: string): Promise<QrAccessRecord | null>;
  findByQrCode(qrCode: string): Promise<QrAccessRecord | null>;
  updateStatus(id: string, status: QrAccessStatus): Promise<QrAccessRecord>;
  createLog(data: CreateQrAccessLogRecord): Promise<QrAccessLogRecord>;
  findLogs(): Promise<QrAccessLogRecord[]>;
}

export const QR_ACCESS_REPOSITORY = Symbol('QR_ACCESS_REPOSITORY');
