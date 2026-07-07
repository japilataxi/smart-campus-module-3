# Auth Service

## Overview

The auth-service manages authentication, authorization and user role management for Smart Campus.

## Responsibilities

- User registration.
- User login.
- JWT token generation.
- User profile validation.
- Role-Based Access Control.
- User role management.
- Audit logging.

## Technologies

- NestJS
- PostgreSQL
- TypeORM
- JWT
- bcrypt
- Swagger/OpenAPI
- Docker
- Prometheus Metrics

## Main Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register institutional user |
| POST | /auth/login | Login user |
| GET | /auth/profile | Get authenticated profile |
| GET | /users | List users - admin only |
| PATCH | /users/:id/roles | Update user roles - admin only |
| GET | /health | Health check |
| GET | /metrics | Prometheus metrics |

## Roles

- student
- librarian
- admin

## Docker Image

```text
japilataxi/auth-service:qa
japilataxi/auth-service:prod


## Environment Variables

```text
PORT=3001
DATABASE_URL=postgresql://auth_user:auth_password@auth-db:5432/auth_db
JWT_SECRET=change_me
JWT_REFRESH_SECRET=change_me_refresh
ADMIN_EMAILS=admin@uce.edu.ec
REDIS_HOST=redis
REDIS_PORT=6379