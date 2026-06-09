
---

# apps/auth-service/README.md

```md
# Auth Service

## Overview

Authentication and authorization microservice for Smart Campus.

Provides JWT authentication, user registration, user profile management, and role-based access control (RBAC).

## Port

3001

## Roles

- student
- librarian
- admin

## Features

- Institutional email validation
- JWT Authentication
- Refresh Tokens
- Role Management
- Protected Endpoints

## Endpoints

POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/refresh

GET /auth/profile

GET /users

PATCH /users/:id/roles

## Technology

- NestJS
- PostgreSQL
- TypeORM
- JWT
- Swagger

## Run

```bash
pnpm start:dev