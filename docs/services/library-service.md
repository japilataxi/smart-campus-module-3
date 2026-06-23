# Library Service

## Overview

The library-service manages books, authors, categories and loan operations for Smart Campus.

## Responsibilities

- Manage authors.
- Manage categories.
- Manage books.
- Create book loans.
- Return book loans.
- Track book availability.

## Technologies

- NestJS
- PostgreSQL
- TypeORM
- Swagger/OpenAPI
- Docker
- Prometheus Metrics

## Main Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /authors | Create author |
| GET | /authors | List authors |
| POST | /categories | Create category |
| GET | /categories | List categories |
| POST | /books | Create book |
| GET | /books | List books |
| POST | /loans | Create loan and decrease availability |
| GET | /loans | List loans |
| GET | /loans/:id | Get loan by id |
| PATCH | /loans/:id/return | Return loan and increase availability |
| GET | /health | Health check |
| GET | /metrics | Prometheus metrics |

## Business Rules

- A book can only be loaned if availableCopies is greater than 0.
- When a loan is created, availableCopies decreases by 1.
- When a loan is returned, availableCopies increases by 1.
- A loan cannot be returned twice.

## Docker Image

```text
japilataxi/library-service:qa
japilataxi/library-service:prod

## Environment Variables

```text
PORT=3002
DATABASE_URL=postgresql://library_user:library_password@library-db:5432/library_db
REDIS_HOST=redis
REDIS_PORT=6379