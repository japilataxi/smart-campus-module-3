import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Loan } from './entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';

import { BooksService } from '../books/books.service';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly repository: Repository<Loan>,

    private readonly booksService: BooksService,
  ) {}

  async create(dto: CreateLoanDto) {
    await this.booksService.decreaseAvailability(dto.bookId);

    const today = new Date();
    const dueDate = new Date();

    dueDate.setDate(dueDate.getDate() + 14);

    const loan = this.repository.create({
      userEmail: dto.userEmail,
      bookId: dto.bookId,
      loanDate: today,
      dueDate,
      returned: false,
    });

    return this.repository.save(loan);
  }

  findAll() {
    return this.repository.find();
  }

  async findById(id: string) {
    const loan = await this.repository.findOne({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    return loan;
  }

  async returnLoan(id: string) {
    const loan = await this.findById(id);

    if (loan.returned) {
      throw new BadRequestException('Loan already returned');
    }

    loan.returned = true;

    await this.booksService.increaseAvailability(loan.bookId);

    return this.repository.save(loan);
  }
}