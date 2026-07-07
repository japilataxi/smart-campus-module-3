variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "smart-campus"
}

variable "environment" {
  default = "qa"
}

variable "key_name" {
  default = "smart-campus-qa-key"
}

variable "my_ip" {
  description = "Your public IP with /32"
  type        = string
}
variable "workflow_service_image" {
  description = "Docker image for workflow-service QA deployment"
  type        = string
  default     = "japilataxi/workflow-service:qa"
}

variable "workflow_service_port" {
  description = "Workflow service port"
  type        = number
  default     = 3024
}

variable "workflow_database_url" {
  description = "Workflow service database URL used by Docker Compose templates"
  type        = string
  default     = "postgresql://workflow_user:workflow_password@workflow-db:5432/workflow_db"
}

variable "n8n_base_url" {
  description = "n8n base URL for workflow automation"
  type        = string
  default     = "http://n8n:5678"
}

variable "n8n_incident_webhook_url" {
  description = "n8n incident-created webhook URL"
  type        = string
  default     = "http://n8n:5678/webhook/incident-created-workflow"
}

variable "n8n_user_registered_webhook_url" {
  description = "n8n user-registered webhook URL"
  type        = string
  default     = "http://n8n:5678/webhook/user-registered-workflow"
}

variable "n8n_library_loan_webhook_url" {
  description = "n8n library-loan-created webhook URL"
  type        = string
  default     = "http://n8n:5678/webhook/library-loan-created-workflow"
}

variable "n8n_critical_notification_webhook_url" {
  description = "n8n critical-notification webhook URL"
  type        = string
  default     = "http://n8n:5678/webhook/critical-notification-workflow"
}
