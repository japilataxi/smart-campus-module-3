import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TransportRouteStatus } from '../../domain/transport-status.enum';

@Entity('transport_routes')
export class TransportRouteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'enum', enum: TransportRouteStatus, default: TransportRouteStatus.ACTIVE })
  status: TransportRouteStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

