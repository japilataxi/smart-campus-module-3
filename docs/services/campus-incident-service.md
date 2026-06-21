
---

## 3. `services/campus-incident-service.md`

```md
# Campus Incident Service

## Overview

The campus-incident-service manages campus incident reports for Smart Campus.

## Responsibilities

- Create incident reports.
- List incidents.
- Get incident details.
- Update incident status.
- Delete incidents.
- Publish incident.created events for notifications.

## Technologies

- NestJS
- PostgreSQL
- TypeORM
- Swagger/OpenAPI
- Docker
- Prometheus Metrics
- RabbitMQ event publishing

## Main Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /incidents | Create incident |
| GET | /incidents | List incidents |
| GET | /incidents/:id | Get incident by id |
| PATCH | /incidents/:id | Update incident |
| DELETE | /incidents/:id | Delete incident |
| GET | /health | Health check |
| GET | /metrics | Prometheus metrics |

## Event Published

| Event | Description |
|---|---|
| incident.created | Published when a new campus incident is registered |

## Docker Image

```text
japilataxi/campus-incident-service:qa
japilataxi/campus-incident-service:prod

## Environment Variables

```text
PORT=3020
DATABASE_URL=postgresql://incident_user:incident_password@campus-incident-db:5432/campus_incidents_db
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=change_me
RABBITMQ_URL=amqp://rabbitmq:5672