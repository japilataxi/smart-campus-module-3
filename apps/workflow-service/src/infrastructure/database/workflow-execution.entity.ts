import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { WorkflowStatus } from '../../domain/enums/workflow-status.enum';

@Entity('workflow_executions')
export class WorkflowExecutionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workflowName!: string;

  @Column()
  sourceService!: string;

  @Column()
  eventType!: string;

  @Column({ type: 'enum', enum: WorkflowStatus, default: WorkflowStatus.Pending })
  status!: WorkflowStatus;

  @Column({ type: 'jsonb' })
  requestPayload!: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  responsePayload?: Record<string, unknown> | null;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string | null;

  @Column({ type: 'varchar', nullable: true })
  triggeredByUserId?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  finishedAt?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
