import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Author } from './authors/entities/author.entity';
import { Category } from './categories/entities/category.entity';
import { Book } from './books/entities/book.entity';
import { Loan } from './loans/entities/loan.entity';

import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { BooksModule } from './books/books.module';
import { LoansModule } from './loans/loans.module';

import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://library_user:library_password@localhost:5434/library_db',
      entities: [
        Author,
        Category,
        Book,
        Loan,
      ],
      synchronize: true,
    }),

    AuthorsModule,
    CategoriesModule,
    BooksModule,
    LoansModule,

    HealthModule,
    MetricsModule,
  ],
})
export class AppModule {}