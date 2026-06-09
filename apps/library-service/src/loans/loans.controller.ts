import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';

@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @ApiOperation({ summary: 'Create a loan and decrease book availability' })
  create(@Body() dto: CreateLoanDto) {
    return this.loansService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all loans' })
  findAll() {
    return this.loansService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan by id' })
  findById(@Param('id') id: string) {
    return this.loansService.findById(id);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Return a loan and increase book availability' })
  returnLoan(@Param('id') id: string) {
    return this.loansService.returnLoan(id);
  }
}