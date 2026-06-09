import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { QrAccessStatus } from '../enums/qr-access-status.enum';

@Entity({ name: 'qr_access_logs' })
export class QrAccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'qr_code', unique: true })
  qrCode: string;

  @Column({ name: 'access_point' })
  accessPoint: string;

  @Column({
    type: 'enum',
    enum: QrAccessStatus,
    default: QrAccessStatus.ACTIVE,
  })
  status: QrAccessStatus;

  @Column({ name: 'attempts_count', default: 0 })
  attemptsCount: number;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'validated_at', type: 'timestamptz', nullable: true })
  validatedAt?: Date | null;

  @Column({ name: 'last_attempt_at', type: 'timestamptz', nullable: true })
  lastAttemptAt?: Date | null;

  @Column({ name: 'last_denial_reason', nullable: true })
  lastDenialReason?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;
}

