
---

# Transport Service

## Overview

The **Transport Service** manages the Smart Campus transportation system.

It allows administrators to manage transportation routes, vehicles, bus stops, schedules, and route availability for students and staff.

The service follows a **Hexagonal Architecture (Ports and Adapters)**, ensuring that the business logic remains independent from infrastructure technologies.

---

# Responsibilities

The Transport Service is responsible for:

* Managing transport routes.
* Managing transport stops.
* Managing transport vehicles.
* Managing transport schedules.
* Checking route availability.
* Caching frequently accessed information using Redis.
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
             TransportController
                       │
                       ▼
              TransportService
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

The service follows the **Ports and Adapters** pattern, where infrastructure components are separated from business logic.

---

# Project Structure

```text
transport-service
│
├── common
│   ├── cache
│   ├── logging
│   ├── metrics
│   └── health
│
├── transport
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

## TransportController

Exposes the REST endpoints used by the frontend and API Gateway.

Responsibilities include:

* Route management
* Stop management
* Vehicle management
* Schedule management
* Availability queries

---

## TransportService

Contains the application's business rules.

Responsibilities:

* Create transport routes
* Update routes
* Create bus stops
* Register vehicles
* Create schedules
* Calculate route availability
* Publish RabbitMQ events
* Manage Redis cache

---

## Repository

Responsible for data persistence using TypeORM.

Implements the repository interface defined in the Application layer.

---

# PostgreSQL

The database stores:

* Transport Routes
* Transport Stops
* Transport Vehicles
* Transport Schedules

All persistent transportation information is stored in PostgreSQL.

---

# Redis

Redis is used to cache frequently requested data.

Examples:

```text
transport:routes
transport:stops:<routeId>
transport:schedules:<routeId>
transport:availability:<routeId>
```

Benefits:

* Faster queries
* Reduced database load
* Better API response times

---

# RabbitMQ Integration

The service publishes domain events asynchronously.

Exchange

```text
smart-campus.events
```

Published Events

| Event                      | Description                        |
| -------------------------- | ---------------------------------- |
| transport.route.created    | A new transport route was created  |
| transport.route.updated    | A transport route was updated      |
| transport.stop.created     | A transport stop was created       |
| transport.vehicle.created  | A transport vehicle was registered |
| transport.schedule.created | A transport schedule was created   |

These events are consumed by the **Notification Service**.

---

# Notification Flow

```text
Create Route
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

The same flow applies for stops, vehicles, and schedules.

---

# REST Endpoints

## Routes

| Method | Endpoint              | Description  |
| ------ | --------------------- | ------------ |
| POST   | /transport/routes     | Create route |
| GET    | /transport/routes     | List routes  |
| GET    | /transport/routes/:id | Get route    |
| PATCH  | /transport/routes/:id | Update route |

---

## Stops

| Method | Endpoint         | Description |
| ------ | ---------------- | ----------- |
| POST   | /transport/stops | Create stop |
| GET    | /transport/stops | List stops  |

---

## Vehicles

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| POST   | /transport/vehicles | Register vehicle |
| GET    | /transport/vehicles | List vehicles    |

---

## Schedules

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| POST   | /transport/schedules | Create schedule |
| GET    | /transport/schedules | List schedules  |

---

## Availability

| Method | Endpoint                           | Description        |
| ------ | ---------------------------------- | ------------------ |
| GET    | /transport/routes/:id/availability | Route availability |

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

Examples:

* HTTP requests
* Response time
* CPU usage
* Memory usage
* Process uptime

Prometheus periodically collects these metrics.

Grafana visualizes them using dashboards.

---

# Docker

The service is packaged as a Docker container.

QA image

```text
japilataxi/transport-service:qa
```

Production image

```text
japilataxi/transport-service:prod
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
Transport Service
```

---

# Frontend Integration

The Next.js web application provides interfaces for:

* Managing transport routes
* Registering vehicles
* Managing bus stops
* Managing schedules
* Viewing route availability

All communication is performed through the API Gateway.

---

# AWS Deployment

The service runs inside a private AWS EC2 instance.

Infrastructure includes:

* Docker
* Docker Compose
* PostgreSQL
* Redis
* RabbitMQ
* Prometheus
* Grafana

Traffic is routed through the Application Load Balancer to the API Gateway.

---

# Monitoring

The service is monitored using:

* Prometheus
* Grafana
* Docker Logs
* Health Checks

This allows administrators to monitor transportation operations and service performance.

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
* Fast cache access
* Containerized deployment
* Cloud-native architecture
* Centralized monitoring
* Easy maintenance

---
