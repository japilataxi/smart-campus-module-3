# Space Availability Service

Business microservice for Smart Campus Module 3. It manages campus spaces and their real-time-ready availability state through REST endpoints.

## Responsibilities

- Create, list, update, deactivate, and delete spaces.
- Manage space type, operational status, and availability status.
- Filter spaces by type, location, and availability status.
- Check whether a space is currently available based on status, availability, and opening hours.
- Cache frequent availability/list queries in Redis.
- Expose Swagger, health checks, and Prometheus metrics.

## Architecture

The service follows Clean Architecture and Hexagonal Architecture:

- `domain`: business models and enums.
- `application`: DTOs, repository ports, and use cases.
- `infrastructure`: TypeORM entities and PostgreSQL repository adapter.
- `interfaces/http`: REST controller.
- `common`: Redis cache, structured logging, health checks, and metrics.

Future integrations such as MQTT, Kafka, RabbitMQ, and WebSocket can be added through new adapters without changing the core use cases.

## Main Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/spaces` | Create a space |
| GET | `/spaces` | List spaces with optional filters |
| GET | `/spaces/:id` | Get a space by id |
| PATCH | `/spaces/:id` | Update a space |
| DELETE | `/spaces/:id` | Delete a space |
| PATCH | `/spaces/:id/deactivate` | Deactivate a space |
| PATCH | `/spaces/:id/availability` | Change availability status |
| GET | `/spaces/available` | List available spaces |
| GET | `/spaces/type/:type` | Filter by type |
| GET | `/spaces/location/:location` | Filter by location |
| GET | `/spaces/:id/check-availability` | Check current availability |
| GET | `/health` | Health check |
| GET | `/metrics` | Prometheus metrics |
| GET | `/docs` | Swagger UI |

## Environment Variables

```env
NODE_ENV=development
PORT=3023
SERVICE_NAME=space-availability-service
DATABASE_URL=postgresql://space_user:space_password@localhost:5439/space_availability_db
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3003
```

## Local Commands

```powershell
corepack pnpm --filter space-availability-service build
corepack pnpm --filter space-availability-service test
corepack pnpm --filter space-availability-service test:e2e
corepack pnpm --filter space-availability-service start:dev
```

## Docker QA Image

```powershell
docker build -f apps/space-availability-service/Dockerfile -t japilataxi/space-availability-service:qa .
docker push japilataxi/space-availability-service:qa
```

## API Gateway

The frontend must call the API Gateway only:

```text
web-app -> api-gateway -> space-availability-service
```

Expected gateway base path:

```text
/api/spaces
```
