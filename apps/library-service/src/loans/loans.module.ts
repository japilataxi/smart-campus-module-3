import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Loan } from './entities/loan.entity';

import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';

import { BooksModule } from '../books/books.module';

import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan]),
    BooksModule,
    RabbitmqModule,
  ],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}