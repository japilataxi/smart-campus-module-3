import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QrAccessStatus } from '../../domain/qr-access-status.enum';
import { QrAccessCodeEntity } from './qr-access-code.entity';

@Entity('qr_access_logs')
export class QrAccessLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  qrAccessCodeId: string | null;

  @Index()
  @Column({ length: 120, nullable: true })
  userId: string | null;

  @Index()
  @Column({ length: 160 })
  qrCode: string;

  @Column({ type: 'enum', enum: QrAccessStatus })
  status: QrAccessStatus;

  @Column({ length: 120, nullable: true })
  location: string | null;

  @Column({ length: 240 })
  message: string;

  @CreateDateColumn({ type: 'timestamptz' })
  attemptDate: Date;

  @ManyToOne(() => QrAccessCodeEntity, (code) => code.logs, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'qrAccessCodeId' })
  qrAccessCode: QrAccessCodeEntity | null;
}
