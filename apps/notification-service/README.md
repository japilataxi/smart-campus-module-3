## Purpose

The notification-service centralizes system notifications for Smart Campus Module 3.

It receives asynchronous events from other microservices through RabbitMQ, stores notifications in PostgreSQL, updates unread counters in Redis, and sends real-time notifications through WebSocket.

## Main Responsibilities

- Consume RabbitMQ events.
- Store notifications in PostgreSQL.
- Cache unread counters in Redis.
- Expose REST endpoints.
- Emit real-time WebSocket events.
- Provide health checks and Prometheus metrics.

## Architecture

The service follows a layered and hexagonal-inspired architecture:

- Domain: notification entities.
- Application: notification use cases.
- Infrastructure: PostgreSQL, Redis, RabbitMQ and WebSocket.
- Interfaces: REST controllers and WebSocket gateway.

## REST Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | List notifications |
| GET | `/notifications/unread` | List unread notifications |
| PATCH | `/notifications/:id/read` | Mark notification as read |
| PATCH | `/notifications/read-all` | Mark all notifications as read |
| DELETE | `/notifications/:id` | Delete notification |
| GET | `/health` | Service health check |
| GET | `/metrics` | Prometheus metrics |

## RabbitMQ

Exchange:

```text
smart-campus.events
````

Consumed routing keys:

```text
user.registered
library.loan.created
library.loan.returned
library.book.reserved
incident.created
incident.status.updated
```

Queues:

```text
notifications.user.registered
notifications.library.loan.created
notifications.library.loan.returned
notifications.library.book.reserved
notifications.incident.created
notifications.incident.status.updated
```

## WebSocket Events

Emitted events:

```text
notification:new
notification:unread-count
```

Received events:

```text
notification:read
```

## Environment Variables

```env
PORT=3010
DATABASE_URL=postgresql://notification_user:notification_password@notification-db:5432/notification_db
REDIS_HOST=redis
REDIS_PORT=6379
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
RABBITMQ_EXCHANGE=smart-campus.events
JWT_SECRET=change_me
```

## Docker

Run with Docker Compose:

```bash
docker compose -f infra/docker/docker-compose.qa.yml up --build notification-service
```

## Testing

```bash
pnpm --filter notification-service test
pnpm --filter notification-service build
```

## Design Principles Applied

* SOLID
* DRY
* KISS
* YAGNI
* Encapsulation
* High cohesion
* Low coupling
* Event Driven Architecture
* Microservices Architecture

````

## 3. Build rápido

```powershell
pnpm --filter notification-service build
pnpm --filter notification-service test
````
