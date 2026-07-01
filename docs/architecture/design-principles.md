
---

# Design Principles

## SOLID

### Single Responsibility Principle (SRP)

Each microservice is responsible for a single business capability.

* **auth-service:** Authentication, authorization, user management and JWT security.
* **library-service:** Book catalog, authors, categories and loan management.
* **campus-incident-service:** Campus incident reporting and resolution.
* **notification-service:** Event consumption, notification persistence and WebSocket delivery.
* **qr-access-service:** QR code generation, validation, revocation and access logging.
* **transport-service:** Transport routes, stops, vehicles, schedules and availability.
* **space-availability-service:** Campus spaces, reservations and availability management.

---

### Open/Closed Principle (OCP)

The platform is designed to be extended by adding new:

* REST endpoints
* Modules
* RabbitMQ events
* Microservices

without modifying existing business logic.

---

### Liskov Substitution Principle (LSP)

Business services depend on repository interfaces rather than concrete implementations.

Infrastructure components such as TypeORM repositories can be replaced without affecting business logic.

---

### Interface Segregation Principle (ISP)

Each application module exposes only the operations required by its consumers.

Repository interfaces, DTOs and services are separated according to their responsibilities.

---

### Dependency Inversion Principle (DIP)

NestJS Dependency Injection is used throughout the platform.

Business services depend on abstractions (Ports) while infrastructure components implement those contracts.

---

# Hexagonal Architecture

All business microservices follow the **Hexagonal Architecture (Ports and Adapters)**.

Each service is organized into:

* Domain
* Application
* Infrastructure
* Interfaces

This architecture isolates business logic from databases, messaging systems and frameworks.

---

# DRY (Don't Repeat Yourself)

The platform promotes code reuse through:

* Shared DTOs
* Shared cache services
* Shared logging modules
* Shared health modules
* Shared metrics modules
* Reusable Docker configurations
* Reusable Terraform templates
* Common CI/CD workflows

---

# KISS (Keep It Simple)

The platform uses simple communication patterns:

* REST APIs for synchronous communication.
* RabbitMQ for asynchronous communication.
* Redis for caching.
* API Gateway as the single entry point.

---

# Encapsulation

Each microservice owns:

* Its own business logic.
* Its own PostgreSQL database.
* Its own Redis cache.
* Its own configuration.
* Its own RabbitMQ publishers.
* Its own implementation details.

No service directly accesses another service's database.

---

# Low Coupling

Services communicate through:

* API Gateway (REST)
* RabbitMQ (Event-Driven Architecture)

Each service can evolve independently with minimal dependencies.

---

# High Cohesion

Each microservice groups functionality belonging to a single bounded context.

Examples:

* auth-service → Identity and Access Management.
* library-service → Library Management.
* campus-incident-service → Campus Incident Management.
* notification-service → Notification Management.
* qr-access-service → QR Access Control.
* transport-service → Campus Transportation.
* space-availability-service → Space Availability Management.

---

# Event-Driven Architecture

RabbitMQ enables asynchronous communication between microservices.

Current published events include:

* user.registered
* library.loan.created
* library.loan.returned
* incident.created
* incident.status.updated
* qr.access.generated
* qr.access.granted
* qr.access.denied
* qr.access.revoked
* transport.route.created
* transport.route.updated
* transport.stop.created
* transport.vehicle.created
* transport.schedule.created
* space.created
* space.updated
* space.deactivated
* space.availability.updated
* space.reservation.created

The Notification Service consumes these events and delivers real-time notifications via WebSockets.

---

# Caching Strategy

Redis is used to improve application performance by caching frequently accessed data.

Examples include:

* Active QR codes
* Transport routes
* Transport schedules
* Space availability
* Notification counters

This reduces database queries and improves response times.

---

# Observability

The platform includes comprehensive monitoring capabilities.

* Health Checks (`/health`)
* Prometheus Metrics (`/metrics`)
* Grafana Dashboards
* Docker Container Monitoring
* Structured Logging

These components provide operational visibility across all microservices.

---

# Scalability

Each microservice can be deployed and scaled independently using:

* Docker
* Docker Compose
* Docker Hub
* AWS EC2

Additional services can be incorporated without impacting existing components.

---

# Security

The platform implements multiple security mechanisms.

* JWT Authentication
* Role-Based Access Control (RBAC)
* API Gateway Routing
* CORS Protection
* Redis session support
* RabbitMQ private messaging
* Private AWS networking
* Bastion Host for secure administration

---

# Cloud Infrastructure

The application is designed for cloud deployment using:

* AWS EC2
* Docker
* Docker Compose
* Docker Hub
* Terraform
* GitHub Actions CI/CD

The infrastructure supports automated deployments, monitoring and scalable service orchestration.

---