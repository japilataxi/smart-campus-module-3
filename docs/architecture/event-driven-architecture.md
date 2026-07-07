
---

# Event-Driven Architecture

## Overview

Smart Campus combines **synchronous** and **asynchronous** communication patterns to achieve scalability, low coupling, and real-time event processing.

---

## Synchronous Communication

Client applications communicate with business services through the API Gateway using REST APIs.

```text
                    +------------------+
                    |  Web / Mobile /  |
                    | Desktop Clients  |
                    +--------+---------+
                             |
                             v
                     API Gateway (REST)
                             |
        +---------+----------+-----------+----------+
        |         |          |           |          |
        v         v          v           v          v
     Auth     Library   Campus      QR Access   Transport
    Service    Service   Incident      Service     Service
                          Service
                             |
                             v
                  Space Availability Service
```

---

## Asynchronous Communication

Business services publish domain events to RabbitMQ.

The Notification Service consumes these events and distributes notifications in real time.

```text
Business Microservices
        |
        v
+----------------------+
|      RabbitMQ        |
| smart-campus.events  |
+----------+-----------+
           |
           v
Notification Service
      |
      +--> PostgreSQL
      +--> Redis
      +--> WebSocket
      |
      v
Next.js Frontend
```

---

# Event Processing Flow

1. A business service executes a business operation.
2. The service publishes a domain event to RabbitMQ.
3. RabbitMQ routes the event to the Notification Service.
4. The Notification Service consumes the event.
5. The notification is stored in PostgreSQL.
6. Redis updates notification counters.
7. A WebSocket event is sent to connected clients.
8. The frontend updates notifications in real time without refreshing the page.

---

# Implemented RabbitMQ Events

| Producer Service           | Published Events           |
| -------------------------- | -------------------------- |
| auth-service               | user.registered            |
| library-service            | library.loan.created       |
| library-service            | library.loan.returned      |
| campus-incident-service    | incident.created           |
| campus-incident-service    | incident.status.updated    |
| qr-access-service          | qr.access.generated        |
| qr-access-service          | qr.access.granted          |
| qr-access-service          | qr.access.denied           |
| qr-access-service          | qr.access.revoked          |
| transport-service          | transport.route.created    |
| transport-service          | transport.route.updated    |
| transport-service          | transport.stop.created     |
| transport-service          | transport.vehicle.created  |
| transport-service          | transport.schedule.created |
| space-availability-service | space.created              |
| space-availability-service | space.updated              |
| space-availability-service | space.deactivated          |
| space-availability-service | space.availability.updated |
| space-availability-service | space.reservation.created  |

---

# Notification Service Responsibilities

The **notification-service** acts as the central event consumer of the platform.

Its responsibilities include:

* Consuming RabbitMQ events.
* Persisting notifications in PostgreSQL.
* Updating unread notification counters in Redis.
* Delivering notifications through WebSockets.
* Exposing Prometheus metrics.
* Providing health checks.
* Supporting Grafana dashboards.

---

# Technologies

* RabbitMQ
* PostgreSQL
* Redis
* WebSocket (Socket.IO)
* NestJS
* Prometheus
* Grafana

---

# Current Communication Technologies

| Technology | Purpose                    |
| ---------- | -------------------------- |
| REST       | Synchronous communication  |
| RabbitMQ   | Asynchronous communication |
| WebSocket  | Real-time notifications    |
| Redis      | Distributed cache          |
| PostgreSQL | Persistent storage         |

---

# Future Evolution

The platform is designed to support additional messaging technologies without affecting existing services.

### Planned Classroom Reservation Service

Communication Technologies

* Apache Kafka

Architecture Patterns

* CQRS
* Event-Driven Architecture

Example Events

* reservation.created
* reservation.approved
* reservation.cancelled

Kafka will be used to demonstrate distributed event streaming and CQRS patterns.

---

## MQTT Integration (Future)

MQTT can be incorporated in future versions for IoT devices such as:

* Smart parking sensors
* Classroom occupancy sensors
* Environmental monitoring
* Smart campus devices

This communication layer can coexist with RabbitMQ without modifying the current architecture.

---

# Benefits

* Low coupling between microservices.
* Independent deployment.
* Event-driven communication.
* Horizontal scalability.
* Better fault tolerance.
* Real-time notifications.
* Independent databases.
* High maintainability.
* Easy integration of new services.
* Support for future messaging technologies.

---

# Architectural Patterns

The Smart Campus platform currently implements:

* Microservices Architecture
* Event-Driven Architecture
* API Gateway Pattern
* Hexagonal Architecture (Ports and Adapters)
* Domain-Driven Design (Bounded Contexts)

Future versions will also incorporate:

* CQRS
* Event Sourcing (optional extension)
* Kafka-based distributed messaging

---




