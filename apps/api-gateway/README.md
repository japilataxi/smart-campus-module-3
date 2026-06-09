# API Gateway

## Overview

The API Gateway is the single entry point for all Smart Campus clients.

It forwards requests to internal microservices and centralizes communication between frontend applications and backend services.

## Port

3000

## Responsibilities

- Request routing
- Authentication request forwarding
- Library request forwarding
- Service abstraction
- Centralized API access

## Routes

### Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile

GET /api/auth/users

PATCH /api/auth/users/:id/roles

### Library

GET /api/library/authors

POST /api/library/authors

GET /api/library/categories

POST /api/library/categories

GET /api/library/books

POST /api/library/books

GET /api/library/loans

POST /api/library/loans

GET /api/library/loans/:id

PATCH /api/library/loans/:id/return

## Technology

- NestJS
- TypeScript
- Axios
- Swagger

## Run

```bash
pnpm start:dev