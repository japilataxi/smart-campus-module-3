# Workflow Service

Workflow Service is a Smart Campus business microservice that integrates campus events with n8n automation workflows through secure webhooks.

## Purpose

The service receives REST events from Smart Campus services or admin users, sends the event payload to the configured n8n webhook, stores the execution history in PostgreSQL, and caches recent results in Redis.

## Architecture

The service follows Clean Architecture and Hexagonal Architecture:

- `domain`: workflow execution model, enums, and repository port.
- `application`: DTOs, use cases, ports, and metrics coordination.
- `infrastructure`: TypeORM repository adapter, n8n webhook adapter, Redis cache adapter, and config.
- `interfaces/http`: REST controller.
- `common`: health, metrics, logging, and cache utilities.
- `security`: JWT and RBAC guards for manual admin triggers.

## REST Endpoints

- `POST /workflows/trigger`
- `POST /workflows/incident-created`
- `POST /workflows/user-registered`
- `POST /workflows/library-loan-created`
- `POST /workflows/critical-notification`
- `GET /workflows/executions`
- `GET /workflows/executions/:id`
- `GET /health`
- `GET /metrics`
- `GET /docs`

## n8n Integration

The service calls n8n webhook URLs configured through environment variables:

- `N8N_INCIDENT_WEBHOOK_URL`
- `N8N_USER_REGISTERED_WEBHOOK_URL`
- `N8N_LIBRARY_LOAN_WEBHOOK_URL`
- `N8N_CRITICAL_NOTIFICATION_WEBHOOK_URL`

The local Docker Compose setup includes n8n at `http://localhost:5678` with basic authentication enabled.

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | HTTP port. Default: `3024`. |
| `SERVICE_NAME` | Service name. Default: `workflow-service`. |
| `DATABASE_URL` | PostgreSQL connection string. |
| `REDIS_HOST` | Redis hostname. |
| `REDIS_PORT` | Redis port. |
| `JWT_SECRET` | Secret used to validate admin JWT tokens. |
| `N8N_BASE_URL` | n8n base URL. |
| `N8N_INCIDENT_WEBHOOK_URL` | n8n incident workflow webhook. |
| `N8N_USER_REGISTERED_WEBHOOK_URL` | n8n user registration workflow webhook. |
| `N8N_LIBRARY_LOAN_WEBHOOK_URL` | n8n library loan workflow webhook. |
| `N8N_CRITICAL_NOTIFICATION_WEBHOOK_URL` | n8n critical notification workflow webhook. |

## Local Commands

```powershell
corepack pnpm install
corepack pnpm --filter workflow-service build
corepack pnpm --filter workflow-service test
corepack pnpm --filter workflow-service test:e2e
corepack pnpm --filter workflow-service start:dev
```

## Docker Commands

```powershell
docker compose -f infra\docker\docker-compose.qa.yml up -d --build workflow-db redis n8n workflow-service api-gateway web-app
```

## Verification

```powershell
curl http://localhost:3024/health
curl http://localhost:3024/metrics
curl http://localhost:3024/workflows/executions
curl http://localhost:3000/api/workflows/executions
```

## Design Principles Applied

- SOLID: business logic is isolated in use cases and abstractions.
- DRY: shared infrastructure patterns are reused from existing services.
- KISS/YAGNI: REST and n8n webhooks are implemented now; Kafka/RabbitMQ consumers can be added later.
- Low coupling: n8n integration is behind a port and adapter.
- High cohesion: workflow execution behavior is grouped in one service.
- GRASP: controller, service, repository, and adapter responsibilities are separated.

## Deployment Notes

QA and production Docker Compose files are prepared to use Docker Hub images:

- `japilataxi/workflow-service:qa`
- `japilataxi/workflow-service:prod`

Terraform QA variables are prepared for image, port, database URL, Redis URL, n8n base URL, and webhook URLs.
