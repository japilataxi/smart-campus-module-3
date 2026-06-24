# Event Driven Architecture

## Overview

Smart Campus combines synchronous and asynchronous communication patterns.

### Synchronous Communication

REST communication is used through the API Gateway.

```text
Web App
   |
API Gateway
   |
+---------------------------+
| Auth Service             |
| Library Service          |
| Campus Incident Service  |
| Notification Service     |
+---------------------------+
```

### Asynchronous Communication

RabbitMQ is used to exchange domain events between microservices.

```text
Business Service
      |
      v
   RabbitMQ
      |
      v
Notification Service
      |
      +--> PostgreSQL
      +--> Redis
      +--> WebSocket Clients
```

---

## Implemented Event Flow

1. A business service performs an action.
2. The service publishes an event to RabbitMQ.
3. notification-service consumes the event.
4. The notification is stored in PostgreSQL.
5. Redis updates unread counters.
6. WebSocket sends the notification to connected clients.

---

## Implemented Events

| Producer Service        | Event                 |
| ----------------------- | --------------------- |
| auth-service            | user.registered       |
| library-service         | library.loan.created  |
| library-service         | library.loan.returned |
| campus-incident-service | incident.created      |

---

## Notification Service Responsibilities

The notification-service acts as an event consumer and notification dispatcher.

### Technologies

* RabbitMQ
* PostgreSQL
* Redis
* WebSocket
* NestJS

### Responsibilities

* Consume events.
* Persist notifications.
* Maintain unread counters.
* Deliver real-time notifications.
* Expose metrics and monitoring information.

---

## Future Evolution

Additional communication technologies will be introduced as new services are implemented.

### Planned Services

#### classroom-reservation-service

Communication:

* Kafka

Architecture Pattern:

* CQRS
* Event Driven

Example Events:

* reservation.created
* reservation.approved
* reservation.cancelled

---

#### space-availability-service

Communication:

* MQTT
* WebSocket

Example Events:

* space.available
* space.occupied

---

## Benefits

* Low coupling between services.
* Independent scalability.
* Improved fault tolerance.
* Better maintainability.
* Clear separation of responsibilities.
* Real-time event processing.
* Support for future microservices expansion.

---

## Architectural Patterns Used

* Microservices Architecture
* Event-Driven Architecture
* API Gateway Pattern
* Hexagonal Architecture
* Domain-Driven Design (bounded contexts)
* CQRS (planned for classroom-reservation-service)
