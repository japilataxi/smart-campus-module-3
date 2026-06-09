# QR Access Service QA Deployment Notes

This service is prepared for lightweight AWS Academy QA deployment using Docker Compose on a small EC2 instance.

## Recommended QA Topology

```text
EC2 instance
  Docker Compose
    api-gateway
    qr-access-service
    qr-access-db
    redis
    prometheus
    grafana
```

## Docker Hub Image

The existing workflow `.github/workflows/docker-publish-qr-access.yml` publishes:

```text
kjkevin/qr-access-service:qa
kjkevin/qr-access-service:<commit-sha>
```

## Required Environment Variables

```env
PORT=3003
DATABASE_HOST=qr-access-db
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=qr_access_db
DATABASE_SYNCHRONIZE=false
REDIS_URL=redis://redis:6379
JWT_SECRET=<qa-secret>
JWT_EXPIRES_IN=8h
```

## Terraform QA Review

QR Access lightweight QA metadata is defined in:

```text
infra/terraform/qa/qr-access-service.tf
infra/terraform/qa/variables.tf
infra/terraform/qa/outputs.tf
infra/terraform/qa/versions.tf
```

Because QR Access is deployed through Docker Compose in QA, no dedicated AWS-managed database, load balancer target group, or service module is required for the lightweight AWS Academy setup.

The Terraform variables include:

```hcl
variable "qr_access_service_image" {
  type        = string
  description = "Docker Hub image used by QR Access Service in QA."
}

variable "qr_access_service_port" {
  type        = number
  description = "Internal and exposed QR Access Service port for lightweight Docker QA."
  default     = 3003
}
```

Expose only the API Gateway publicly. Keep `qr-access-service`, `qr-access-db`, and Redis inside the Docker network.

## QA Validation Commands

```powershell
docker compose up -d qr-access-db redis qr-access-service
Invoke-RestMethod http://localhost:3003/health
Invoke-RestMethod http://localhost:3003/metrics
```
