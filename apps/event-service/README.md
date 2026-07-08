# Event Service

## Descripción

El **Event Service** es un microservicio del proyecto **Smart Campus Module 3** encargado de la gestión de eventos universitarios. Permite crear, consultar, actualizar, cancelar eventos y administrar el registro de participantes.

Además, publica eventos mediante Kafka para integrarse con otros microservicios siguiendo una arquitectura orientada a eventos.

---

## Funcionalidades

- Crear eventos.
- Obtener todos los eventos.
- Obtener un evento por ID.
- Actualizar eventos.
- Cancelar eventos.
- Registrar participantes.
- Consultar participantes registrados.
- Integración con Kafka.
- Métricas con Prometheus.
- Endpoint de Health Check.
- Documentación Swagger.

---

## Tecnologías

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Kafka
- Redis
- Docker
- Swagger
- Jest

---

## Variables de entorno

```env
PORT=3030

DATABASE_URL=postgresql://postgres:postgres@event-db:5432/event_db

KAFKA_BROKERS=kafka:9092

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=your-secret-key
```

---

## Instalación

```bash
pnpm install
```

---

## Ejecutar en desarrollo

```bash
pnpm start:dev
```

---

## Ejecutar pruebas

```bash
pnpm test
```

Resultado esperado:

```
Test Suites: 2 passed
Tests: 4 passed
```

---

## Docker

Construir imagen:

```bash
docker build -t event-service .
```

Ejecutar:

```bash
docker compose -f infra/docker/docker-compose.qa.yml up -d event-service
```

---

## Endpoints

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | /events | Obtener todos los eventos |
| GET | /events/:id | Obtener evento por ID |
| POST | /events | Crear evento |
| PATCH | /events/:id | Actualizar evento |
| PATCH | /events/:id/cancel | Cancelar evento |
| GET | /events/:id/registrations | Obtener registros |
| POST | /events/:id/registrations | Registrar participante |
| DELETE | /events/:id/registrations/:registrationId | Eliminar registro |

---

## Health Check

```
GET /health
```

---

## Métricas

```
GET /metrics
```

---

## Swagger

```
http://localhost:3030/docs
```

---

## Arquitectura

```
src/
├── application/
├── domain/
├── infrastructure/
├── interfaces/
├── metrics/
└── health/
```

---

## Autor

Proyecto desarrollado para la asignatura **Smart Campus Module 3**.