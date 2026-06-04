import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Author } from '../../authors/entities/author.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  isbn!: string;

  @Column()
  totalCopies!: number;

  @Column()
  availableCopies!: number;

  @ManyToOne(() => Author, {
    eager: true,
  })
  author!: Author;

  @ManyToOne(() => Category, {
    eager: true,
  })
  category!: Category;

  @CreateDateColumn()
  createdAt!: Date;
}