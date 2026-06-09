# QR Access Service

Business microservice for Smart Campus Module 3 responsible for QR-based campus access management.

This service belongs to the `smart-campus-module-3` monorepo and is implemented as an independent NestJS microservice with PostgreSQL persistence, Redis cache, Swagger/OpenAPI documentation, health checks, Prometheus-compatible metrics, Docker support, GitHub Actions CI compatibility, and lightweight QA deployment readiness for AWS Academy.

## Service Scope

`qr-access-service` is a business microservice. It is responsible only for QR access business rules.

The `api-gateway` is not a business microservice. It must only expose public REST routes and forward requests to this service through REST.

## Current Branch

```text
feature/qr-access-transport-services
```

Expected pull request flow:

```text
feature/qr-access-transport-services -> dev -> qa -> main
```

Only the engineer approves `qa -> main`.

## Main Features

- Generate QR access codes.
- Validate QR access codes.
- Register QR access attempts.
- Manage access statuses: `active`, `used`, `expired`, `revoked`.
- Associate QR access codes with `userId`.
- Include expiration date for each QR access code.
- Store QR access logs in PostgreSQL.
- Cache active QR codes in Redis when `REDIS_URL` is configured.
- Provide REST endpoints.
- Provide Swagger/OpenAPI documentation.
- Provide health checks at `GET /health`.
- Provide Prometheus-compatible metrics at `GET /metrics`.
- Emit structured JSON logs.
- Support Docker and Docker Compose.
- Support GitHub Actions CI.
- Include QA deployment notes and Terraform QA metadata.

## Architecture

The service follows Clean Architecture and Hexagonal Architecture principles.

The controller layer handles HTTP requests and delegates business operations to the application service.

The application service contains QR access use cases and depends on ports, not concrete infrastructure.

Infrastructure adapters implement those ports:

- PostgreSQL persistence through TypeORM.
- Redis cache through `ioredis`.

This keeps business logic decoupled from PostgreSQL and Redis details.

## Architectural Layers

```text
src/
  qr-access/
    dto/              # Request/response DTOs and validation
    entities/         # PostgreSQL TypeORM entities
    enums/            # Business enums
    ports/            # Hexagonal architecture ports
    repositories/     # TypeORM repository adapter
    cache/            # Redis cache adapter
    qr-access.service.ts
    qr-access.controller.ts
    qr-access.module.ts
  common/
    health/           # Health check endpoint
    logging/          # Structured JSON logging
    metrics/          # Prometheus-compatible metrics
  config/             # App, database, JWT, Swagger, TypeORM config
```

## Hexagonal Ports

The application service depends on these ports:

```text
QrAccessRepositoryPort
QrAccessCachePort
```

Current adapters:

```text
TypeOrmQrAccessRepository
QrAccessCacheService
```

Future Kafka events such as `QRAccessValidated` or `QRAccessDenied` can be added behind a new application port without changing the REST API.

Kafka is intentionally not implemented in this version.

## Technology Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Redis
- Docker
- Docker Compose
- Swagger/OpenAPI
- Prometheus-compatible metrics
- GitHub Actions
- Terraform QA metadata
- AWS Academy lightweight deployment approach

## REST Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/qr-access/generate` | Generate a QR access code |
| `POST` | `/qr-access/validate` | Validate a QR access code |
| `PATCH` | `/qr-access/:id/revoke` | Revoke a QR access record |
| `GET` | `/qr-access/logs` | List QR access logs |
| `GET` | `/qr-access/:id` | Get a QR access record by ID |
| `DELETE` | `/qr-access/:id` | Soft delete a QR access record |
| `GET` | `/health` | Health check |
| `GET` | `/metrics` | Prometheus-compatible metrics |
| `GET` | `/api/docs` | Swagger documentation |

## QR Access Statuses

| Status | Meaning |
| --- | --- |
| `active` | QR code can still be validated |
| `used` | QR code was successfully validated |
| `expired` | QR code expiration date has passed |
| `revoked` | QR code was manually revoked |

## Request Examples

Generate QR access code:

```http
POST /qr-access/generate
Content-Type: application/json

{
  "userId": "student-001",
  "accessPoint": "main-library",
  "expiresInMinutes": 15
}
```

Validate QR access code:

```http
POST /qr-access/validate
Content-Type: application/json

{
  "qrCode": "QR-ACCESS-EXAMPLE",
  "accessPoint": "main-library"
}
```

Revoke QR access code:

```http
PATCH /qr-access/{id}/revoke
Content-Type: application/json

{
  "reason": "Manual security revocation."
}
```

## PostgreSQL Setup

The service uses a PostgreSQL database dedicated to QR Access.

Entity:

```text
qr_access_logs
```

Important columns:

- `id`
- `user_id`
- `qr_code`
- `access_point`
- `status`
- `attempts_count`
- `expires_at`
- `validated_at`
- `last_attempt_at`
- `last_denial_reason`
- `created_at`
- `updated_at`
- `deleted_at`

## Redis Setup

Redis is used for active QR validation cache when `REDIS_URL` is configured.

Cache key pattern:

```text
qr-access:active:{qrCode}
```

The cache TTL is calculated from the QR expiration date.

When a QR code is validated, expired, or revoked, the cache entry is removed.

## Environment Variables

```env
NODE_ENV=development
PORT=3003

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=smart_campus
DATABASE_PASSWORD=smart_campus
DATABASE_NAME=smart_campus_qr_access
DATABASE_SYNCHRONIZE=true

REDIS_URL=redis://localhost:6379

JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=1h
```

For Docker Compose:

```env
PORT=3003
DATABASE_HOST=qr-access-db
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=qr_access_db
DATABASE_SYNCHRONIZE=true
REDIS_URL=redis://redis:6379
JWT_SECRET=smart-campus-qr-access-secret
JWT_EXPIRES_IN=8h
```

## Local Development

From the repository root:

```powershell
npm install
npm run start:dev --workspace=qr-access-service
```

Or from the service folder:

```powershell
cd apps/qr-access-service
npm install
copy .env.example .env
npm run start:dev
```

## Docker

Build the Docker image from the service folder:

```powershell
cd apps/qr-access-service
docker build -t qr-access-service .
```

Run with an environment file:

```powershell
docker run --env-file .env -p 3003:3003 qr-access-service
```

## Docker Compose

From the repository root:

```powershell
docker compose up -d qr-access-db redis qr-access-service
```

Validate service health:

```powershell
Invoke-RestMethod http://localhost:3003/health
```

Validate metrics:

```powershell
Invoke-RestMethod http://localhost:3003/metrics
```

Open Swagger:

```text
http://localhost:3003/api/docs
```

## Swagger/OpenAPI

Swagger is configured in:

```text
src/config/swagger.config.ts
```

Swagger URL:

```text
GET /api/docs
```

## Health Check

Health check endpoint:

```text
GET /health
```

The health check verifies PostgreSQL connectivity using NestJS Terminus and TypeORM health indicator.

## Prometheus Metrics

Metrics endpoint:

```text
GET /metrics
```

The endpoint returns Prometheus-compatible text metrics, including:

- service up indicator
- process uptime
- heap memory usage

Prometheus scrape target example:

```yaml
- job_name: "qr-access-service"
  metrics_path: /metrics
  static_configs:
    - targets: ["qr-access-service:3003"]
```

## Structured Logging

The service emits structured JSON logs through `JsonLoggerService`.

Example:

```json
{
  "timestamp": "2026-06-09T00:00:00.000Z",
  "level": "log",
  "service": "qr-access-service",
  "context": "Bootstrap",
  "message": "QR Access Service is running on port 3003"
}
```

This format is suitable for Docker logs, CloudWatch-style log collection, and CI diagnostics.

## Testing

Run unit tests:

```powershell
npm test --workspace=qr-access-service
```

Run functional HTTP/e2e tests:

```powershell
npm run test:e2e --workspace=qr-access-service
```

Run build and tests through Turborepo:

```powershell
npx turbo run test --filter=qr-access-service
```

Current test coverage includes:

- QR code generation.
- QR code validation.
- Already used QR rejection.
- Missing QR record handling.
- HTTP functional generation flow.
- HTTP validation payload rejection.
- HTTP validation flow.
- HTTP revocation flow.

## GitHub Actions CI

CI workflow:

```text
.github/workflows/qr-access-service-ci.yml
```

The workflow runs:

- dependency installation
- unit tests
- e2e tests
- service build

Docker publishing workflow:

```text
.github/workflows/docker-publish-qr-access.yml
```

Docker Hub image:

```text
kjkevin/qr-access-service:qa
```

## API Gateway Routing

Gateway routing documentation:

```text
docs/api/qr-access-api-gateway-routing.md
```

Expected communication:

```text
web-app -> api-gateway -> qr-access-service
```

Recommended gateway environment variable:

```env
QR_ACCESS_SERVICE_URL=http://qr-access-service:3003
```

The gateway should forward REST calls to this service. The gateway must not contain QR Access business logic.

## QA Deployment

QA deployment documentation:

```text
docs/deployment/qr-access-qa-deployment.md
```

The QA approach is intentionally lightweight for AWS Academy:

- Docker Compose on a small EC2 instance.
- PostgreSQL container for QR Access.
- Redis container shared by services.
- QR Access Docker image from Docker Hub.
- Public access should go through the API Gateway.
- Internal service ports should remain inside the Docker network when possible.

## Terraform QA

Terraform QA metadata is defined in:

```text
infra/terraform/qa/qr-access-service.tf
infra/terraform/qa/variables.tf
infra/terraform/qa/outputs.tf
infra/terraform/qa/versions.tf
```

The Terraform files define lightweight QR Access QA deployment metadata:

- service name
- Docker image
- service port
- PostgreSQL database values
- Redis URL
- health path
- metrics path

No dedicated RDS, ALB, Kafka, RabbitMQ, MQTT, gRPC, or WebSocket infrastructure is created for this version.

## Future Event Integration

Kafka is not implemented in this version.

Future events can be added later behind a new application port:

- `QRAccessValidated`
- `QRAccessDenied`
- `QRAccessRevoked`
- `QRAccessExpired`

This keeps the current REST implementation stable and compatible with future event-driven architecture.

## Commands Before Pull Request

From the repository root:

```powershell
git status
npx turbo run test --filter=qr-access-service
npm run test:e2e --workspace=qr-access-service
docker compose config
```

If Terraform is installed locally:

```powershell
terraform fmt -check -recursive infra/terraform
terraform -chdir=infra/terraform/qa init -backend=false
terraform -chdir=infra/terraform/qa validate
```

## Conventional Commit

Recommended commit message:

```text
feat(qr-access): complete service architecture and QA readiness
```

## Pull Request

PR target:

```text
feature/qr-access-transport-services -> dev
```

Recommended PR title:

```text
feat(qr-access): complete QR access microservice
```

Recommended PR description:

```md
## Summary

- Completed QR Access Service business capabilities.
- Added QR generation, validation, revocation, attempts tracking, and access status management.
- Added Clean Architecture and Hexagonal Architecture boundaries with repository and cache ports.
- Added PostgreSQL persistence and Redis cache for active QR validation.
- Added Swagger/OpenAPI, health check, Prometheus-compatible metrics, and structured JSON logging.
- Added Docker Compose integration, GitHub Actions CI, QA deployment documentation, and Terraform QA metadata.

## Validation

- npx turbo run test --filter=qr-access-service
- npm run test:e2e --workspace=qr-access-service
- docker compose config

## Notes

- API Gateway routing is documented because the gateway source is not present in this repository.
- Kafka events are intentionally not implemented in this version, but the architecture is ready for future event ports.
- QA deployment is kept lightweight for AWS Academy.
```

