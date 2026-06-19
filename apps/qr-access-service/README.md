# QR Access Service

QR Access Service is a Smart Campus business microservice responsible for generating, validating, revoking, and auditing QR access codes.

## Responsibilities

- Generate QR access codes associated with a `userId`.
- Validate QR access codes through REST endpoints.
- Register every access attempt in an audit log.
- Manage QR access status: `ACTIVE`, `USED`, `EXPIRED`, and `REVOKED`.
- Store QR access codes and logs in PostgreSQL.
- Cache active QR codes in Redis while they are valid.
- Expose Swagger/OpenAPI documentation.
- Expose health and Prometheus metrics endpoints.

## Architecture

The service follows Clean Architecture and Hexagonal Architecture principles:

```text
src/qr-access
  domain/                       Domain models and status enum
  application/dto/              Input DTOs and validation rules
  application/ports/            Repository port used by the use case layer
  application/use-cases/        Business service and QR validation rules
  infrastructure/entities/      TypeORM PostgreSQL entities
  infrastructure/repositories/  TypeORM repository adapter
  interfaces/http/              REST controller
```

The application layer depends on a repository port. The TypeORM repository is an infrastructure adapter. This keeps the business logic independent from the database implementation and leaves room for future event publishing, such as Kafka events for `QRAccessValidated` or `QRAccessDenied`.

## REST API

Base path inside the service:

```text
/qr-access
```

Expected API Gateway path:

```text
/api/qr-access
```

Endpoints:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/qr-access` | Generate a QR access code |
| `GET` | `/qr-access` | List QR access codes |
| `POST` | `/qr-access/validate` | Validate a QR access code and register the attempt |
| `PATCH` | `/qr-access/:id/revoke` | Revoke a QR access code |
| `GET` | `/qr-access/logs` | List access attempts |
| `GET` | `/health` | Service and PostgreSQL health check |
| `GET` | `/metrics` | Prometheus metrics |
| `GET` | `/docs` | Swagger/OpenAPI documentation |

## Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `PORT` | Service port | `3021` |
| `SERVICE_NAME` | Structured logging service name | `qr-access-service` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://qr_access_user:qr_access_password@localhost:5437/qr_access_db` |
| `REDIS_HOST` | Redis hostname | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |

## Local Development

Install dependencies from the monorepo root:

```powershell
corepack pnpm install
```

Run only this service:

```powershell
corepack pnpm --filter qr-access-service start:dev
```

Build:

```powershell
corepack pnpm --filter qr-access-service build
```

Run tests:

```powershell
corepack pnpm --filter qr-access-service test
corepack pnpm --filter qr-access-service test:e2e
```

## Docker Compose QA

From the repository root:

```powershell
docker compose -f infra/docker/docker-compose.qa.yml up --build qr-access-service qr-access-db redis
```

Verify:

```powershell
Invoke-RestMethod http://localhost:3021/health
Invoke-RestMethod http://localhost:3021/metrics
```

Swagger:

```text
http://localhost:3021/docs
```

## API Gateway Communication

The frontend must not call this service directly. The communication path is:

```text
web-app -> api-gateway -> qr-access-service
```

The API Gateway uses:

```text
QR_ACCESS_SERVICE_URL=http://qr-access-service:3021
```

## QA and AWS Academy

QA keeps deployment lightweight for AWS Academy:

- API Gateway runs in its own private EC2 instance.
- QR Access Service runs in its own private EC2 instance.
- QR Access PostgreSQL and Redis run in the same QR Access QA instance through Docker Compose.
- The public ALB only exposes the web app and `/api/*` through the API Gateway.

Deployment flow:

```text
feature/qr-access-service -> dev -> qa -> main
```

Docker Hub image expected later:

```text
japilataxi/qr-access-service:qa
```

## Conventional Commit

Recommended commit message:

```text
feat(qr-access): add QR access microservice and gateway integration
```

## Pull Request

Title:

```text
feat(qr-access): add QR access microservice and frontend integration
```

Description:

```text
## Summary
- Added NestJS QR Access business microservice with Clean/Hexagonal Architecture.
- Added PostgreSQL entities for QR access codes and access logs.
- Added Redis cache for active QR validation.
- Added REST endpoints, Swagger, health checks, Prometheus metrics, structured logging, and tests.
- Added API Gateway routing for /api/qr-access.
- Added Docker Compose, QA deployment, CI, and Terraform QA updates.

## Verification
- corepack pnpm --filter qr-access-service build
- corepack pnpm --filter qr-access-service test
- corepack pnpm --filter qr-access-service test:e2e
- corepack pnpm --filter api-gateway build
- corepack pnpm --filter web-app build
```
