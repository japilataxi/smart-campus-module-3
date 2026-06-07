# Campus Incident Service

## Description

Campus Incident Service is a microservice developed with NestJS for managing incidents reported within the Smart Campus platform.

The service allows users to create, retrieve, update, and delete incidents through a REST API.

---

## Technologies

* NestJS
* TypeScript
* PostgreSQL
* TypeORM
* Swagger
* Docker
* GitHub Actions
* AWS

---

## Features

* Create incidents
* List incidents
* Get incident by ID
* Update incidents
* Delete incidents
* Health check endpoint
* Metrics endpoint
* Swagger documentation

---

## API Endpoints

### Incidents

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /incidents     |
| GET    | /incidents     |
| GET    | /incidents/:id |
| PATCH  | /incidents/:id |
| DELETE | /incidents/:id |

### Monitoring

| Method | Endpoint |
| ------ | -------- |
| GET    | /health  |
| GET    | /metrics |

---

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5435/campus_incidents_db
PORT=3020
```

## Run Locally

Install dependencies:

```bash
pnpm install
```

Run development server:

```bash
pnpm run start:dev
```

Application URL:

```text
http://localhost:3020
```

---

## Swagger Documentation

Swagger UI:

```text
http://localhost:3020/docs
```

---

## Docker

Build image:

```bash
docker build -t campus-incident-service .
```

Run container:

```bash
docker run -p 3020:3020 campus-incident-service
```

---

## Database

Database Engine:

* PostgreSQL 16

Database Name:

```text
campus_incidents_db
```

---

## Project Structure

```text
src
├── incidents
│   ├── dto
│   ├── entities
│   ├── incidents.controller.ts
│   ├── incidents.service.ts
│   └── incidents.module.ts
├── health
├── metrics
├── app.module.ts
└── main.ts
```

---

## Author

Smart Campus Project – Group 3 Diego Lema
