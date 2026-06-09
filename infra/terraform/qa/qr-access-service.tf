locals {
  qr_access_service_name = "${var.project_name}-${var.environment}-qr-access-service"

  qr_access_environment = {
    PORT                   = tostring(var.qr_access_service_port)
    DATABASE_HOST          = "qr-access-db"
    DATABASE_PORT          = "5432"
    DATABASE_USERNAME      = var.qr_access_database_user
    DATABASE_PASSWORD      = var.qr_access_database_password
    DATABASE_NAME          = var.qr_access_database_name
    DATABASE_SYNCHRONIZE   = "false"
    REDIS_URL              = "redis://redis:6379"
    JWT_SECRET             = "replace-with-aws-academy-qa-secret"
    JWT_EXPIRES_IN         = "8h"
  }

  qr_access_docker_compose_services = {
    qr-access-db = {
      image = "postgres:16"
      port  = "5436:5432"
    }

    qr-access-service = {
      image = var.qr_access_service_image
      port  = "${var.qr_access_service_port}:${var.qr_access_service_port}"
    }
  }
}
