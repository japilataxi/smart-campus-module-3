# SMART CAMPUS UCE - Module 3

Distributed Programming final project for Module 3: Smart Campus Services.

This repository contains the enterprise-grade base structure for a NestJS microservices platform using PostgreSQL, Redis, MQTT, Docker, Docker Compose, Terraform, GitHub Actions, Swagger, JWT authentication, and role-based access control.

## Repository Structure

```text
smart-campus-module-3/
├── apps/
├── docker/
├── docs/
├── infra/
│   └── terraform/
│       ├── qa/
│       └── prod/
└── .github/
    └── workflows/
```

## Branching Model

- `main`: production branch.
- `qa`: testing and release validation branch.
- `dev`: integration branch.
- `feature/*`: individual development branches.

Pull requests must target `qa` first.

## Engineering Standards

- All source code, comments, documentation, and commit messages must be written in English.
- Commit messages must follow Conventional Commits.
- Each microservice must include Swagger documentation.
- Each microservice must include unit tests.
- Each microservice must include its own Dockerfile.
- Authentication must use JWT.
- Authorization must use role-based access control.
- Infrastructure changes must follow GitOps principles through pull requests and GitHub Actions.
- Terraform remote state must be stored in AWS S3.

## Local Infrastructure

Start shared local dependencies:

```bash
docker compose up -d
```

http://localhost:3001/api/docs
docker compose down
docker compose up --build 
en la raiz del proyecto