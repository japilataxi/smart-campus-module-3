import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly repository: Repository<Author>,
  ) {}

  create(dto: CreateAuthorDto) {
    const author = this.repository.create(dto);
    return this.repository.save(author);
  }

  findAll() {
    return this.repository.find();
  }
}