import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CampusEventCategory } from '../enums/campus-event-category.enum';
import { CampusEventStatus } from '../enums/campus-event-status.enum';
import { EventRegistration } from './event-registration.entity';

@Entity('campus_events')
export class CampusEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 150 })
  location: string;

  @Column({
    type: 'enum',
    enum: CampusEventCategory,
    default: CampusEventCategory.GENERAL,
  })
  category: CampusEventCategory;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'int' })
  capacity: number;

  @Column({
    type: 'enum',
    enum: CampusEventStatus,
    default: CampusEventStatus.ACTIVE,
  })
  status: CampusEventStatus;

  @Column({ type: 'uuid' })
  createdByUserId: string;

  @OneToMany(() => EventRegistration, (registration) => registration.event)
  registrations: EventRegistration[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}