# Transport Service

Smart Campus Transport Service is a NestJS business microservice for managing campus transport routes, stops, schedules, vehicles, and route availability.

## Project Context

Repository: `smart-campus-module-3`

Branch strategy:

- `main`: production
- `qa`: QA environment
- `dev`: integration environment
- `feature/*`: development branches

Pull request flow:

`feature/transport-service -> dev -> qa -> main`

The API Gateway is only the entry point and routing layer. This service owns the transport business logic and data.

## Stack

- NestJS
- TypeScript
- PostgreSQL
- Redis
- Docker
- Docker Compose
- Swagger/OpenAPI
- Prometheus metrics
- GitHub Actions CI
- Terraform QA compatibility
- AWS Academy lightweight deployment

## Architecture

The service follows Clean Architecture and Hexagonal Architecture:

```text
src/
  common/
    cache/                 Redis cache adapter
    health/                Health check endpoint
    logging/               Structured JSON logger
    metrics/               Prometheus metrics endpoint
  transport/
    domain/                Business models and enums
    application/
      dto/                 Request DTOs and validation
      ports/               Repository port
      use-cases/           Business service/use cases
    infrastructure/
      entities/            PostgreSQL TypeORM entities
      repositories/        TypeORM repository adapter
    interfaces/http/       REST controller
```

The application layer depends on a repository port, not TypeORM directly. TypeORM is an infrastructure adapter. This keeps the service ready for future MQTT or WebSocket adapters without changing the core business use cases.

## Features

- Manage transport routes.
- Manage stops.
- Manage schedules.
- Manage buses or vehicles.
- Show route availability.
- Cache frequent route, stop, schedule, and availability queries with Redis.
- Store service-owned data in PostgreSQL.
- Provide REST endpoints for API Gateway communication.
- Provide Swagger documentation.
- Provide health and metrics endpoints.
- Provide unit and e2e tests.
- Use structured JSON logging.

## Runtime Endpoints

Service base URL locally: `http://localhost:3022`

API Gateway base URL locally: `http://localhost:3000/api`

| Method | Service Path | Gateway Path | Description |
| --- | --- | --- | --- |
| `POST` | `/transport/routes` | `/api/transport/routes` | Create a route |
| `GET` | `/transport/routes` | `/api/transport/routes` | List routes |
| `GET` | `/transport/routes/:id` | `/api/transport/routes/:id` | Get route by ID |
| `PATCH` | `/transport/routes/:id` | `/api/transport/routes/:id` | Update route |
| `GET` | `/transport/routes/:id/availability` | `/api/transport/routes/:id/availability` | Show route availability |
| `POST` | `/transport/stops` | `/api/transport/stops` | Create a stop |
| `GET` | `/transport/stops` | `/api/transport/stops` | List stops |
| `POST` | `/transport/vehicles` | `/api/transport/vehicles` | Create a vehicle |
| `GET` | `/transport/vehicles` | `/api/transport/vehicles` | List vehicles |
| `POST` | `/transport/schedules` | `/api/transport/schedules` | Create a schedule |
| `GET` | `/transport/schedules` | `/api/transport/schedules` | List schedules |
| `GET` | `/health` | direct service only | Health check |
| `GET` | `/metrics` | direct service only | Prometheus metrics |
| `GET` | `/docs` | direct service only | Swagger documentation |

## Status Values

Route status:

- `ACTIVE`
- `INACTIVE`
- `MAINTENANCE`

Vehicle status:

- `AVAILABLE`
- `IN_SERVICE`
- `MAINTENANCE`
- `OUT_OF_SERVICE`

Schedule status:

- `SCHEDULED`
- `DELAYED`
- `CANCELLED`
- `COMPLETED`

## Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `SERVICE_NAME` | Service name for logs and health | `transport-service` |
| `PORT` | HTTP port | `3022` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://transport_user:transport_password@transport-db:5432/transport_db` |
| `TRANSPORT_DATABASE_URL` | Optional CI-specific DB URL fallback | `postgresql://transport_user:transport_password@localhost:5438/transport_db` |
| `REDIS_HOST` | Redis host | `redis` |
| `REDIS_PORT` | Redis port | `6379` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |

## Local Development

From the repository root:

```powershell
corepack pnpm install
corepack pnpm --filter transport-service start:dev
```

Swagger:

```text
http://localhost:3022/docs
```

Health:

```powershell
curl http://localhost:3022/health
```

Metrics:

```powershell
curl http://localhost:3022/metrics
```

## Verification Commands

```powershell
corepack pnpm --filter transport-service build
corepack pnpm --filter transport-service test
corepack pnpm --filter transport-service test:e2e
corepack pnpm --filter api-gateway build
corepack pnpm --filter api-gateway test
```

Docker Compose validation:

```powershell
docker compose -f infra/docker/docker-compose.qa.yml config
docker compose -f infra/docker/docker-compose.qa.deploy.yml config
docker compose -f infra/docker/docker-compose.transport.qa.yml config
```

## Docker

Build QA image from the repository root:

```powershell
docker build -f apps/transport-service/Dockerfile -t japilataxi/transport-service:qa .
docker push japilataxi/transport-service:qa
```

## QA Deployment Notes

The QA Docker and Terraform files include this service as a lightweight AWS Academy deployment:

- Dedicated PostgreSQL database container for the service.
- Dedicated EC2 instance for `transport-service` in QA Terraform.
- Dedicated security group allowing gateway-to-service traffic on port `3022`.
- API Gateway environment variable: `TRANSPORT_SERVICE_URL`.

Run Terraform only after the QA Docker image is pushed to Docker Hub.

```powershell
cd infra/terraform/qa
terraform init
terraform validate
terraform plan -var="my_ip=<your-public-ip>/32"
terraform apply -var="my_ip=<your-public-ip>/32"
```

## Future Real-Time Support

MQTT and WebSocket are intentionally not implemented in this first version. The architecture is prepared for future adapters:

- MQTT adapter for campus transport and IoT location updates.
- WebSocket adapter for real-time bus or route location updates.

The current implementation uses REST only.

## Conventional Commit Example

```text
feat(transport): add transport service microservice and QA integration
```

## Pull Request

Title:

```text
feat(transport): add transport service microservice and QA integration
```

Description:

```markdown
## Summary
- Added NestJS Transport Service with Clean/Hexagonal Architecture.
- Added PostgreSQL entities for routes, stops, vehicles, and schedules.
- Added Redis cache for frequent route, stop, schedule, and availability queries.
- Added REST endpoints, Swagger, health check, Prometheus metrics, structured logging, and tests.
- Added API Gateway routing for `/api/transport`.
- Added Docker Compose QA, CI, and Terraform QA compatibility.

## Verification
- pnpm --filter transport-service build
- pnpm --filter transport-service test
- pnpm --filter transport-service test:e2e
- docker compose -f infra/docker/docker-compose.qa.yml config
- terraform validate
```
