
---

# Space Availability Service

## Overview

The **Space Availability Service** manages the availability of campus spaces within the Smart Campus platform.

It allows administrators to register, update, reserve, and monitor classrooms, laboratories, auditoriums, meeting rooms, and other university spaces.

The service follows a **Hexagonal Architecture (Ports and Adapters)**, ensuring that the business logic is isolated from infrastructure components.

---

# Responsibilities

The Space Availability Service is responsible for:

* Managing campus spaces.
* Updating space information.
* Managing space availability.
* Reserving spaces.
* Checking real-time availability.
* Caching frequently requested data using Redis.
* Publishing asynchronous events to RabbitMQ.
* Exposing REST APIs.
* Providing Health Checks.
* Exposing Prometheus metrics.
* Generating Swagger documentation.

---

# Architecture

```text
                    REST API
                       │
                       ▼
              SpaceController
                       │
                       ▼
               SpaceService
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
 Repository Port   Redis Cache   RabbitMQ Publisher
      │
      ▼
 TypeORM Repository
      │
      ▼
   PostgreSQL
```

The service follows the **Ports and Adapters (Hexagonal)** architecture, separating business logic from infrastructure implementations.

---

# Project Structure

```text
space-availability-service
│
├── common
│   ├── cache
│   ├── logging
│   ├── metrics
│   └── health
│
├── space
│   ├── application
│   │      ├── dto
│   │      ├── ports
│   │      └── use-cases
│   │
│   ├── domain
│   │
│   ├── infrastructure
│   │      ├── entities
│   │      └── repositories
│   │
│   └── interfaces
│          └── http
│
├── app.module.ts
├── main.ts
└── Dockerfile
```

---

# Main Components

## SpaceController

Responsible for exposing the REST API.

Main operations include:

* Create spaces
* Update spaces
* Delete spaces
* Reserve spaces
* Check availability
* Filter spaces

---

## SpaceService

Contains the business rules.

Responsibilities include:

* Register new spaces
* Update information
* Change availability status
* Create reservations
* Verify current availability
* Publish RabbitMQ events
* Update Redis cache

---

## Repository

Responsible for data persistence.

Implements the repository port using TypeORM.

---

# PostgreSQL

Stores all persistent information.

Main entities include:

* Campus Spaces
* Availability Status
* Reservations

This information remains permanently stored in PostgreSQL.

---

# Redis

Redis is used as a high-speed cache.

Examples:

```text
spaces:list:{}
spaces:<id>
spaces:list:<filters>
```

Benefits:

* Faster searches
* Reduced database load
* Improved response time
* Better scalability

---

# RabbitMQ Integration

The service publishes domain events.

Exchange

```text
smart-campus.events
```

Published Events

| Event                      | Description                    |
| -------------------------- | ------------------------------ |
| space.created              | A new campus space was created |
| space.updated              | Space information was updated  |
| space.deactivated          | A space was deactivated        |
| space.availability.updated | Space availability changed     |
| space.reservation.created  | A reservation was created      |

The Notification Service consumes these events and generates real-time notifications.

---

# Notification Flow

```text
Create Space
      │
      ▼
Save PostgreSQL
      │
      ▼
Update Redis
      │
      ▼
Publish RabbitMQ Event
      │
      ▼
Notification Service
      │
      ▼
WebSocket
      │
      ▼
Next.js Frontend
```

The same workflow is used for updates, reservations, and availability changes.

---

# REST Endpoints

## Spaces

| Method | Endpoint    | Description  |
| ------ | ----------- | ------------ |
| POST   | /spaces     | Create space |
| GET    | /spaces     | List spaces  |
| GET    | /spaces/:id | Get space    |
| PATCH  | /spaces/:id | Update space |
| DELETE | /spaces/:id | Delete space |

---

## Availability

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| PATCH  | /spaces/:id/availability | Update availability   |
| GET    | /spaces/:id/availability | Check availability    |
| GET    | /spaces/available        | List available spaces |

---

## Reservations

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | /spaces/reservations | Create reservation |

---

## Search

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | /spaces?type=     | Filter by type     |
| GET    | /spaces?location= | Filter by location |

---

## Health

```text
GET /health
```

---

## Metrics

```text
GET /metrics
```

---

## Swagger

```text
GET /docs
```

---

# Observability

The service exposes metrics compatible with Prometheus.

Examples include:

* HTTP requests
* Response latency
* Memory consumption
* CPU usage
* Process uptime

Prometheus periodically collects these metrics.

Grafana displays dashboards for monitoring application performance and availability.

---

# Docker

The service is distributed as a Docker container.

QA image

```text
japilataxi/space-availability-service:qa
```

Production image

```text
japilataxi/space-availability-service:prod
```

---

# API Gateway

All client requests pass through the API Gateway.

```text
Client
   │
   ▼
API Gateway
   │
   ▼
Space Availability Service
```

---

# Frontend Integration

The Next.js application provides interfaces for:

* Creating campus spaces
* Updating space information
* Viewing available spaces
* Reserving spaces
* Monitoring availability

All requests are routed through the API Gateway.

---

# AWS Deployment

The service is deployed inside a private AWS EC2 instance.

Infrastructure components include:

* Docker
* Docker Compose
* PostgreSQL
* Redis
* RabbitMQ
* Prometheus
* Grafana

The Application Load Balancer forwards requests to the API Gateway, which routes them to the Space Availability Service.

---

# Monitoring

The service is continuously monitored using:

* Prometheus
* Grafana
* Docker Logs
* Health Checks

This enables administrators to monitor service health, resource consumption, and operational status.

---

# Technologies

* NestJS
* TypeScript
* PostgreSQL
* Redis
* RabbitMQ
* TypeORM
* Docker
* Docker Compose
* Swagger/OpenAPI
* Prometheus
* Grafana
* AWS EC2
* GitHub Actions
* Docker Hub

---

# Benefits

* Hexagonal Architecture
* High scalability
* Low coupling
* High cohesion
* Event-Driven communication
* Fast Redis caching
* Containerized deployment
* Cloud-native infrastructure
* Centralized monitoring
* Easy maintenance

---


