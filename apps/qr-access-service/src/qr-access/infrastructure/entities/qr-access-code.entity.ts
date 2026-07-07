import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { QrAccessStatus } from '../../domain/qr-access-status.enum';
import { QrAccessLogEntity } from './qr-access-log.entity';

@Entity('qr_access_codes')
export class QrAccessCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 120 })
  userId!: string;

  @Index({ unique: true })
  @Column({ length: 160 })
  qrCode!: string;

  @Column({ length: 80 })
  accessType!: string;

  @Column({ length: 120 })
  location!: string;

  @Index()
  @Column({ type: 'enum', enum: QrAccessStatus, default: QrAccessStatus.ACTIVE })
  status!: QrAccessStatus;

  @Index()
  @Column({ type: 'timestamptz' })
  expirationDate!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => QrAccessLogEntity, (log) => log.qrAccessCode)
  logs!: QrAccessLogEntity[];
}
