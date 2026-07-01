
---

# QR Access Service

## Overview

The **QR Access Service** is responsible for managing secure QR codes used to control access to Smart Campus facilities.

It allows authorized users to:

* Generate QR access codes.
* Validate QR codes.
* Revoke access.
* Register access attempts.
* Publish events to RabbitMQ.
* Notify other microservices asynchronously.

The service follows a **Hexagonal Architecture (Ports and Adapters)**, making the business logic independent from frameworks and infrastructure.

---

# Responsibilities

The service provides the following business capabilities:

* Generate campus QR access codes.
* Validate QR codes.
* Revoke QR access.
* Store access history.
* Cache active QR codes using Redis.
* Publish domain events to RabbitMQ.
* Expose REST APIs.
* Provide Health Checks.
* Expose Prometheus metrics.
* Generate Swagger documentation.

---

# Architecture

```
                    REST API
                       │
                       ▼
             QrAccessController
                       │
                       ▼
              QrAccessService
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
 Repository Port   Redis Cache   RabbitMQ Publisher
        │
        ▼
 TypeORM Repository
        │
        ▼
     PostgreSQL
```

The service follows the Ports and Adapters pattern.

Business logic never depends directly on PostgreSQL or Redis.

---

# Project Structure

```
qr-access-service
│
├── common
│   ├── cache
│   ├── logging
│   ├── metrics
│   └── health
│
├── qr-access
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

## Controller

Responsible for exposing REST endpoints.

Examples:

* Generate QR
* Validate QR
* List QR codes
* Revoke QR
* View access logs

---

## Service

Contains all business rules.

Responsibilities:

* Generate QR code
* Validate access
* Revoke access
* Update status
* Publish RabbitMQ events
* Update Redis cache

---

## Repository

Responsible for persistence using TypeORM.

It implements the repository port defined in the Application layer.

---

## PostgreSQL

Stores:

* QR Access Codes
* QR Access Logs

---

# Redis

Redis stores temporary information.

Examples:

```
qr-access:active:<qrCode>
```

Benefits:

* Faster validation
* Reduced database access
* Automatic expiration

---

# RabbitMQ Integration

The service publishes asynchronous events.

Exchange

```
smart-campus.events
```

Published Events

| Event               | Description             |
| ------------------- | ----------------------- |
| qr.access.generated | A QR code was generated |
| qr.access.granted   | Access granted          |
| qr.access.denied    | Access denied           |
| qr.access.revoked   | QR revoked              |

These events are consumed by the Notification Service.

---

# Notification Flow

```
Generate QR
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

---

# REST Endpoints

## QR Codes

| Method | Endpoint            | Description   |
| ------ | ------------------- | ------------- |
| POST   | /qr-access          | Generate QR   |
| POST   | /qr-access/validate | Validate QR   |
| GET    | /qr-access          | List QR codes |
| DELETE | /qr-access/:id      | Revoke QR     |

---

## Logs

| Method | Endpoint        |
| ------ | --------------- |
| GET    | /qr-access/logs |

---

## Health

```
GET /health
```

---

## Metrics

```
GET /metrics
```

---

## Swagger

```
GET /docs
```

---

# Observability

The service exposes Prometheus metrics.

Examples

* HTTP requests
* Response times
* Active requests
* Process memory
* CPU usage

Prometheus periodically scrapes the metrics endpoint.

Grafana visualizes these metrics through dashboards.

---

# Docker

The service is containerized using Docker.

QA image

```
japilataxi/qr-access-service:qa
```

Production image

```
japilataxi/qr-access-service:prod
```

---

# API Gateway

All requests pass through the API Gateway.

```
Client
   │
   ▼
API Gateway
   │
   ▼
QR Access Service
```

---

# Frontend Integration

The Next.js application provides:

* QR generation
* QR validation
* Access history
* Access logs

The frontend communicates exclusively through the API Gateway.

---

# AWS Deployment

The service is deployed inside a private EC2 instance.

Infrastructure includes:

* Docker
* Docker Compose
* PostgreSQL
* Redis
* RabbitMQ
* Prometheus
* Grafana

The Application Load Balancer routes external requests to the API Gateway.

---

# Monitoring

The service is monitored using:

* Prometheus
* Grafana
* Health Checks
* Docker Logs

This enables continuous monitoring of service availability and performance.

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
* Low coupling
* High cohesion
* Event-Driven communication
* High scalability
* Easy maintenance
* Centralized monitoring
* Real-time notifications
* Containerized deployment
* Cloud-ready architecture

---