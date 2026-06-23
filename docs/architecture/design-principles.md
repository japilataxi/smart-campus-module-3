# Design Principles

## SOLID

### Single Responsibility Principle (SRP)

Each microservice has a single business responsibility:

* auth-service: authentication and authorization.
* library-service: library management.
* campus-incident-service: incident management.
* notification-service: event processing and notification delivery.

### Open/Closed Principle (OCP)

The platform is designed to be extended through new endpoints, modules and microservices without modifying existing business logic.

### Liskov Substitution Principle (LSP)

DTOs, interfaces and service contracts are respected across the application, allowing interchangeable implementations.

### Interface Segregation Principle (ISP)

Each module exposes only the operations required by its consumers.

### Dependency Inversion Principle (DIP)

NestJS Dependency Injection is used throughout the system to decouple business logic from infrastructure concerns.

---

## DRY (Don't Repeat Yourself)

* Shared DTOs and reusable services.
* Centralized configuration management.
* Reusable Docker, CI/CD and infrastructure patterns.

---

## KISS (Keep It Simple, Stupid)

The platform uses straightforward communication patterns:

* REST APIs for synchronous communication.
* RabbitMQ for asynchronous communication.
* API Gateway as the single entry point.

---

## Encapsulation

Each microservice owns:

* Its business logic.
* Its database.
* Its configuration.
* Its internal implementation details.

No service accesses another service's database directly.

---

## Low Coupling

Services communicate through:

* API Gateway (synchronous requests).
* RabbitMQ events (asynchronous communication).

This minimizes direct dependencies between services.

---

## High Cohesion

All functionality inside a microservice belongs to the same business domain and bounded context.

Examples:

* auth-service contains only authentication and authorization logic.
* library-service contains only library operations.
* campus-incident-service contains only incident management.
* notification-service contains only notification-related functionality.

---

## Observability

The platform includes monitoring and diagnostics capabilities:

* Health Checks (/health)
* Prometheus Metrics (/metrics)
* Grafana Dashboards
* Docker Container Monitoring

This allows operational visibility across all services.

---

## Scalability

Services are independently deployable and scalable through Docker containers and cloud infrastructure.

Future services can be added without impacting existing services.

---

## Security

The platform implements:

* JWT Authentication
* Role-Based Access Control (RBAC)
* CORS Protection
* API Gateway Routing
* Private Network Segmentation in AWS
* Bastion Host Access
