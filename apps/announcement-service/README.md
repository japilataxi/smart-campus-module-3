# Announcement Service

Microservice responsible for managing institutional announcements in Smart Campus Module 3.

## Responsibilities

- Create announcements
- Update announcements
- Delete announcements
- Publish announcements
- Archive announcements
- List announcements
- Filter announcements
- Search announcements
- Emit Kafka events for announcement changes

## Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- KafkaJS
- Docker
- Swagger
- Prometheus Metrics

## Local Port

```txt
3007

##  Environment Variables

```env
PORT=3007
DATABASE_URL=postgresql://announcement_user:announcement_password@announcement-db:5432/announcement_db
KAFKA_CLIENT_ID=announcement-service
KAFKA_BROKERS=localhost:9092
KAFKA_ANNOUNCEMENTS_TOPIC=campus.announcements
CORS_ORIGIN=*
NODE_ENV=development
```

PORT=3007
DATABASE_URL=postgresql://announcement_user:announcement_password@announcement-db:5432/announcement_db
KAFKA_CLIENT_ID=announcement-service
KAFKA_BROKERS=localhost:9092
KAFKA_ANNOUNCEMENTS_TOPIC=campus.announcements
CORS_ORIGIN=*
NODE_ENV=development

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| POST   | `/announcements`             | Create announcement     |
| GET    | `/announcements`             | List announcements      |
| GET    | `/announcements/:id`         | Get announcement detail |
| PATCH  | `/announcements/:id`         | Update announcement     |
| PATCH  | `/announcements/:id/publish` | Publish announcement    |
| PATCH  | `/announcements/:id/archive` | Archive announcement    |
| DELETE | `/announcements/:id`         | Delete announcement     |
| GET    | `/health`                    | Health check            |
| GET    | `/metrics`                   | Prometheus metrics      |
| GET    | `/docs`                      | Swagger documentation   |

campus.announcements

AnnouncementCreated
AnnouncementUpdated
AnnouncementPublished
AnnouncementArchived
AnnouncementDeleted

notification-service consumes AnnouncementPublished events to create notifications and emit WebSocket updates.

Run Locally
pnpm --dir apps/announcement-service start:dev
Build
pnpm --dir apps/announcement-service build
Docker Build
docker build -f apps/announcement-service/Dockerfile -t announcement-service:local .
Swagger
http://localhost:3007/docs
Health
http://localhost:3007/health
Metrics
http://localhost:3007/metrics
Important Notes

During local development, the service may temporarily use an existing PostgreSQL database until announcement-db is added to Docker Compose and Terraform.

Before production deployment, the service must use its own database:

announcement_db

Después guarda y verifica:


