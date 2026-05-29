import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { BookLoanStatus } from '../enums/book-loan-status.enum';

@Entity('book_loans')
export class BookLoan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  bookId!: string;

  @Column()
  studentId!: string;

  @Column()
  loanDate!: Date;

  @Column({ nullable: true })
  returnDate!: Date;

  @Column({
    type: 'enum',
    enum: BookLoanStatus,
    default: BookLoanStatus.ACTIVE,
  })
  status!: BookLoanStatus;

  @ManyToOne(() => Book)
  book!: Book;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}