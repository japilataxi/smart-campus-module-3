import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('LibraryService Functional Tests', () => {
  let app: INestApplication;

  let authorId: string;
  let categoryId: string;
  let bookId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an author', async () => {
    const response = await request(app.getHttpServer())
      .post('/authors')
      .send({
        name: `Author ${Date.now()}`,
        biography: 'Functional test author',
      })
      .expect(201);

    authorId = response.body.id;

    expect(response.body.name).toBeDefined();
    expect(authorId).toBeDefined();
  });

  it('should create a category', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .send({
        name: `Category ${Date.now()}`,
      })
      .expect(201);

    categoryId = response.body.id;

    expect(response.body.name).toBeDefined();
    expect(categoryId).toBeDefined();
  });

  it('should create a book', async () => {
    const response = await request(app.getHttpServer())
      .post('/books')
      .send({
        title: 'Functional Test Book',
        isbn: `${Date.now()}`,
        totalCopies: 3,
        authorId,
        categoryId,
      })
      .expect(201);

    bookId = response.body.id;

    expect(response.body.title).toBe('Functional Test Book');
    expect(response.body.availableCopies).toBe(3);
    expect(bookId).toBeDefined();
  });

  it('should create a loan and decrease availability', async () => {
    const response = await request(app.getHttpServer())
      .post('/loans')
      .send({
        userEmail: 'student@uce.edu.ec',
        bookId,
      })
      .expect(201);

    expect(response.body.userEmail).toBe('student@uce.edu.ec');
    expect(response.body.bookId).toBe(bookId);
  });

  it('should list books', async () => {
    const response = await request(app.getHttpServer())
      .get('/books')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    const createdBook = response.body.find(
      (book: any) => book.id === bookId,
    );

    expect(createdBook.availableCopies).toBe(2);
  });
});