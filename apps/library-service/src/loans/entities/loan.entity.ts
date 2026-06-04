import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userEmail!: string;

  @Column()
  bookId!: string;

  @Column()
  loanDate!: Date;

  @Column()
  dueDate!: Date;

  @Column({
    default: false,
  })
  returned!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}