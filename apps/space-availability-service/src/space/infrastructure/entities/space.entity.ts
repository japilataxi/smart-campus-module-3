import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  SpaceAvailabilityStatus,
  SpaceStatus,
  SpaceType,
} from '../../domain/space-status.enum';

@Entity('spaces')
export class SpaceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: SpaceType })
  type: SpaceType;

  @Column()
  location: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'enum', enum: SpaceStatus, default: SpaceStatus.Active })
  status: SpaceStatus;

  @Column({
    name: 'availability_status',
    type: 'enum',
    enum: SpaceAvailabilityStatus,
    default: SpaceAvailabilityStatus.Available,
  })
  availabilityStatus: SpaceAvailabilityStatus;

  @Column({ name: 'opening_time', type: 'varchar', length: 5 })
  openingTime: string;

  @Column({ name: 'closing_time', type: 'varchar', length: 5 })
  closingTime: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
