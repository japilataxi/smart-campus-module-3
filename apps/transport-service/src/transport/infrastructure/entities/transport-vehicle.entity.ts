import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TransportVehicleStatus } from '../../domain/transport-status.enum';

@Entity('transport_vehicles')
export class TransportVehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  plate: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'enum', enum: TransportVehicleStatus, default: TransportVehicleStatus.AVAILABLE })
  status: TransportVehicleStatus;

  @Column({ nullable: true })
  currentRouteId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

