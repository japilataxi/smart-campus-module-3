import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './entities/book.entity';

import { AuthorsService } from '../authors/authors.service';
import { CategoriesService } from '../categories/categories.service';

import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,

    private readonly authorsService: AuthorsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(dto: CreateBookDto) {
    const author =
      await this.authorsService.findAll().then(
        (authors) =>
          authors.find(
            (author) =>
              author.id === dto.authorId,
          ),
      );

    const category =
      await this.categoriesService.findById(
        dto.categoryId,
      );

    if (!author) {
      throw new NotFoundException(
        'Author not found',
      );
    }

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    const book = this.repository.create({
      title: dto.title,
      isbn: dto.isbn,
      totalCopies: dto.totalCopies,
      availableCopies: dto.totalCopies,
      author,
      category,
    });

    return this.repository.save(book);
  }

  findAll() {
    return this.repository.find();
  }

  findById(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  async decreaseAvailability(id: string) {
    const book = await this.findById(id);

    if (!book) {
      throw new NotFoundException(
        'Book not found',
      );
    }

    if (book.availableCopies <= 0) {
      throw new NotFoundException(
        'No copies available',
      );
    }

    book.availableCopies--;

    return this.repository.save(book);
  }
}