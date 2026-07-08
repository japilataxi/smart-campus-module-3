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
## Transactional Outbox

This service contains the reusable Transactional Outbox implementation under `src/common/outbox`, but it is not enabled by default because the current QR access service does not publish RabbitMQ or Kafka integration events.

Services that produce events should import `OutboxModule`, add `OutboxEvent` to their TypeORM entities, and save the business entity plus the outbox event inside the same PostgreSQL transaction using `OutboxService.runInTransaction()`.

The common outbox table is `outbox_events` and contains:

- `id`
- `aggregate_id`
- `aggregate_type`
- `event_type`
- `payload`
- `status`
- `retry_count`
- `max_retries`
- `error_message`
- `created_at`
- `processed_at`
- `updated_at`

The supported statuses are `PENDING`, `PROCESSING`, `PUBLISHED`, and `FAILED`.

The retry strategy is handled by `OutboxPublisher`: pending events are claimed periodically, published through the configured RabbitMQ or Kafka publisher, marked as `PUBLISHED` on success, retried on failure, and moved to `FAILED` when `max_retries` is reached.

See `docs/architecture/transactional-outbox.md` for the full architecture, ACID explanation, RabbitMQ/Kafka mapping, failure scenarios, and adoption guide.

