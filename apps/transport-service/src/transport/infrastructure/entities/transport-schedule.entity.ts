import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TransportScheduleStatus } from '../../domain/transport-status.enum';

@Entity('transport_schedules')
export class TransportScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  routeId: string;

  @Column({ nullable: true })
  vehicleId?: string;

  @Column({ type: 'timestamptz' })
  departureTime: Date;

  @Column({ type: 'timestamptz' })
  arrivalTime: Date;

  @Column({ type: 'enum', enum: TransportScheduleStatus, default: TransportScheduleStatus.SCHEDULED })
  status: TransportScheduleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

