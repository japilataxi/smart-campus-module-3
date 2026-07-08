import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CampusEvent } from './campus-event.entity';
import { EventRegistrationStatus } from '../enums/event-registration-status.enum';

@Entity('event_registrations')
export class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  eventId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({
    type: 'enum',
    enum: EventRegistrationStatus,
    default: EventRegistrationStatus.REGISTERED,
  })
  status!: EventRegistrationStatus;

  @CreateDateColumn()
  registeredAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt!: Date | null;

  @ManyToOne(() => CampusEvent, (event) => event.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event!: CampusEvent;
}