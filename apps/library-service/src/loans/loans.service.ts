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

import { RabbitmqPublisherService } from '../rabbitmq/rabbitmq-publisher.service';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly repository: Repository<Loan>,

    private readonly booksService: BooksService,
    private readonly rabbitmqPublisher: RabbitmqPublisherService,
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

    const savedLoan = await this.repository.save(loan);

    await this.rabbitmqPublisher.publish('library.loan.created', {
      userId: savedLoan.userEmail,
      title: 'New library loan',
      message: `A new library loan was created for ${savedLoan.userEmail}`,
      type: 'INFO',
      sourceService: 'library-service',
      eventType: 'LibraryLoanCreated',
      loanId: savedLoan.id,
      bookId: savedLoan.bookId,
      userEmail: savedLoan.userEmail,
      payload: savedLoan,
    });

    return savedLoan;
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

    const returnedLoan = await this.repository.save(loan);

    await this.rabbitmqPublisher.publish('library.loan.returned', {
      userId: returnedLoan.userEmail,
      title: 'Library loan returned',
      message: `Loan ${returnedLoan.id} was returned by ${returnedLoan.userEmail}`,
      type: 'INFO',
      sourceService: 'library-service',
      eventType: 'LibraryLoanReturned',
      loanId: returnedLoan.id,
      bookId: returnedLoan.bookId,
      userEmail: returnedLoan.userEmail,
      payload: returnedLoan,
    });

    return returnedLoan;
  }
}