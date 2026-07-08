# API Gateway

## Overview

The API Gateway is the single entry point for all Smart Campus clients.

It forwards requests to internal microservices and centralizes communication between frontend applications and backend services.

## Port

3000

## Responsibilities

- Request routing
- Authentication request forwarding
- Library request forwarding
- Service abstraction
- Centralized API access

## Routes

### Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile

GET /api/auth/users

PATCH /api/auth/users/:id/roles

### Library

GET /api/library/authors

POST /api/library/authors

GET /api/library/categories

POST /api/library/categories

GET /api/library/books

POST /api/library/books

GET /api/library/loans

POST /api/library/loans

GET /api/library/loans/:id

PATCH /api/library/loans/:id/return

## Technology

- NestJS
- TypeScript
- Axios
- Swagger

## Run

```bash
pnpm start:dev
## Circuit Breaker Resilience

The API Gateway includes a Circuit Breaker implementation for HTTP calls to downstream microservices.

### What Circuit Breaker Is

Circuit Breaker is a resilience pattern that prevents the gateway from repeatedly calling a downstream service that is failing or timing out. When failures pass the configured threshold, the circuit opens and the gateway immediately returns a controlled fallback response.

### Why It Was Implemented

The API Gateway depends on multiple microservices. If one service is down, slow, or unreachable, the gateway should not crash or keep waiting indefinitely. Circuit Breaker improves fault tolerance and protects clients from uncontrolled errors.

### Where It Was Implemented

The implementation lives in:

```text
src/common/resilience/
├── resilience.module.ts
├── circuit-breaker.service.ts
├── circuit-breaker.constants.ts
└── circuit-breaker.types.ts
```

The gateway applies it through `ProxyService.forwardRequest()`, so existing route handlers and endpoint paths remain unchanged.

### Protected Downstream Services

- `auth-service`
- `library-service`
- `campus-incident-service`
- `notification-service`
- `qr-access-service`
- `transport-service`
- `space-availability-service`
- `workflow-service`

### Configuration

```env
CIRCUIT_BREAKER_TIMEOUT_MS=5000
CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE=50
CIRCUIT_BREAKER_RESET_TIMEOUT_MS=30000
CIRCUIT_BREAKER_ROLLING_WINDOW_SIZE=10
CIRCUIT_BREAKER_MINIMUM_REQUESTS=2
```

### Fallback Response

When a downstream service is unavailable or the circuit is open, the gateway returns HTTP `503` with a controlled response:

```json
{
  "statusCode": 503,
  "message": "Service temporarily unavailable",
  "service": "library-service"
}
```

### Metrics

The following Prometheus metrics are exposed through `/metrics`:

- `circuit_breaker_open_total`
- `circuit_breaker_fallback_total`
- `downstream_request_failures_total`

### Validation

```powershell
cd apps\api-gateway
npm test -- --runInBand
npm run build
```

