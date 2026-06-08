# Campus Incident Service

## Descripción

Campus Incident Service es un microservicio del proyecto Smart Campus Module 3.  
Su función principal es gestionar incidentes reportados dentro del campus universitario.

Permite registrar, consultar, actualizar y eliminar incidentes mediante una API REST desarrollada con NestJS.

## Tecnologías utilizadas

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Swagger
- Docker
- Docker Compose
- GitHub Actions
- Terraform
- AWS

## Funcionalidades

- Crear incidentes
- Listar incidentes
- Consultar incidente por ID
- Actualizar incidente
- Eliminar incidente
- Documentación con Swagger
- Health Check
- Métricas del servicio
- Integración con frontend

## Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/incidents` | Crear incidente |
| GET | `/incidents` | Listar incidentes |
| GET | `/incidents/:id` | Consultar incidente por ID |
| PATCH | `/incidents/:id` | Actualizar incidente |
| DELETE | `/incidents/:id` | Eliminar incidente |
| GET | `/health` | Verificar estado del servicio |
| GET | `/metrics` | Ver métricas del servicio |

## Modelo de datos

El microservicio maneja la entidad `Incident` con los siguientes campos:

| Campo | Descripción |
|---|---|
| id | Identificador único |
| title | Título del incidente |
| description | Descripción del incidente |
| location | Ubicación del incidente |
| status | Estado del incidente |
| createdAt | Fecha de creación |

## Variables de entorno

```env
PORT=3020
DATABASE_URL=postgresql://incident_user:incident_password@campus-incident-db:5432/campus_incidents_db
JWT_SECRET=change_me