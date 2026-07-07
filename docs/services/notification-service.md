# Notification Service

## Overview

The Notification Service is responsible for processing and delivering notifications across the Smart Campus platform.

It consumes asynchronous events through RabbitMQ, persists notification data in PostgreSQL, manages unread notification counters using Redis, and distributes real-time notifications to connected clients through WebSocket.

---

## Responsibilities

* Consume domain events from other microservices.
* Store notification records.
* Track unread notifications.
* Deliver real-time notifications.
* Expose monitoring metrics.
* Support horizontal scalability.

---

## Architecture

Pattern:

* Microservices Architecture
* Event-Driven Architecture
* Hexagonal Architecture
* REST + WebSocket Communication

Technologies:

* NestJS
* PostgreSQL
* Redis
* RabbitMQ
* WebSocket Gateway
* Docker
* Prometheus
* Grafana

---

## Communication Flow

Producer Services

* auth-service
* library-service
* campus-incident-service

Message Broker

* RabbitMQ

Consumer

* notification-service

Delivery

* WebSocket clients
* REST API consumers

---

## Events Consumed

### User Events

* user.registered

### Library Events

* library.loan.created
* library.loan.returned

### Incident Events

* incident.created

---

## REST Endpoints

### Notifications

GET /notifications

GET /notifications/:id

PATCH /notifications/:id/read

PATCH /notifications/read-all

DELETE /notifications/:id

---

## WebSocket Events

### Server → Client

* notification.created
* notification.read
* notification.unread-count

### Client → Server

* notifications.subscribe

---

## Persistence

### PostgreSQL

Stores:

* Notification
* NotificationHistory

### Redis

Stores:

* Unread counters
* Active user sessions
* Temporary cache

---

## Monitoring

### Health Check

GET /health

### Metrics

GET /metrics

Prometheus Metrics:

* notification_service_status
* notification_service_notifications_created_total
* notification_service_unread_notifications_total
* notification_service_rabbitmq_messages_consumed_total
* notification_service_websocket_connected_clients

---

## Deployment

Containerized using Docker.

Supported environments:

* Development
* QA
* Production

Images:

* japilataxi/notification-service:qa
* japilataxi/notification-service:prod

---

## Quality Assurance

* Unit Tests
* Integration Tests
* E2E Tests
* Swagger/OpenAPI Documentation
* Health Checks
* Metrics Monitoring

---

## Related Services

* api-gateway
* auth-service
* library-service
* campus-incident-service
