# QR Access Service

NestJS microservice responsible for generating, validating, listing, retrieving, and deleting QR access records for SMART CAMPUS UCE.

## Features

- PostgreSQL persistence with TypeORM.
- JWT authentication.
- RBAC roles: `ADMIN`, `STUDENT`, `TEACHER`.
- Swagger API documentation.
- Environment variable support.
- Health check endpoint.
- Request validation with `class-validator`.
- Global exception handling.
- Unit tests with Jest.

## Endpoints

- `POST /qr-access/generate`
- `POST /qr-access/validate`
- `GET /qr-access/logs`
- `GET /qr-access/:id`
- `DELETE /qr-access/:id`
- `GET /health`

## Local Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

Swagger is available at:

```text
http://localhost:3003/api/docs
```

## Tests

```bash
npm test
```

## Docker

```bash
docker build -t qr-access-service .
docker run --env-file .env -p 3003:3003 qr-access-service
```

