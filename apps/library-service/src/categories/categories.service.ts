import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto) {
    const category = this.repository.create(dto);
    return this.repository.save(category);
  }

  findAll() {
    return this.repository.find();
  }

  findById(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }
}