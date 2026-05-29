import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookStatus } from '../enums/book-status.enum';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column({ unique: true })
  isbn!: string;

  @Column()
  category!: string;

  @Column()
  totalCopies!: number;

  @Column()
  availableCopies!: number;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.ACTIVE,
  })
  status!: BookStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}