variable "project_name" {
  description = "Project name used for QA deployment metadata."
  type        = string
  default     = "smart-campus"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "qa"
}

variable "qr_access_service_image" {
  description = "Docker Hub image used by QR Access Service in QA."
  type        = string
  default     = "kjkevin/qr-access-service:qa"
}

variable "qr_access_service_port" {
  description = "Internal and exposed QR Access Service port for lightweight Docker QA."
  type        = number
  default     = 3003
}

variable "qr_access_database_name" {
  description = "PostgreSQL database name for QR Access Service."
  type        = string
  default     = "qr_access_db"
}

variable "qr_access_database_user" {
  description = "PostgreSQL username for QR Access Service."
  type        = string
  default     = "postgres"
}

variable "qr_access_database_password" {
  description = "PostgreSQL password for QR Access Service in lightweight QA."
  type        = string
  default     = "postgres"
  sensitive   = true
}
