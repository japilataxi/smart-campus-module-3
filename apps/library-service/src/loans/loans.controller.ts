import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';

@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(
    private readonly loansService: LoansService,
  ) {}

  @Post()
  create(@Body() dto: CreateLoanDto) {
    return this.loansService.create(dto);
  }

  @Get()
  findAll() {
    return this.loansService.findAll();
  }
}