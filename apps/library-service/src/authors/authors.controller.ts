import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(
    private readonly authorsService: AuthorsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create author',
  })
  create(
    @Body()
    dto: CreateAuthorDto,
  ) {
    return this.authorsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all authors',
  })
  findAll() {
    return this.authorsService.findAll();
  }
}