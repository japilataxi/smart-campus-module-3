
---

# apps/library-service/README.md

```md
# Library Service

## Overview

Library management microservice for Smart Campus.

Provides management of authors, categories, books, loans, and loan returns.

## Port

3002

## Features

- Author Management
- Category Management
- Book Catalog
- Loan Creation
- Loan Return Workflow

## Entities

### Author

Stores author information.

### Category

Stores book categories.

### Book

Stores book inventory and availability.

### Loan

Stores active and returned loans.

## Endpoints

### Authors

GET /authors

POST /authors

### Categories

GET /categories

POST /categories

### Books

GET /books

POST /books

### Loans

GET /loans

POST /loans

GET /loans/:id

PATCH /loans/:id/return

## Loan Workflow

Create Loan:

- Validate book exists
- Validate available copies
- Decrease availability
- Create loan

Return Loan:

- Validate loan exists
- Mark returned
- Increase availability

## Technology

- NestJS
- PostgreSQL
- TypeORM
- Swagger

## Run

```bash
pnpm start:dev