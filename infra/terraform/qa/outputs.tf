output "qr_access_service_name" {
  description = "QR Access Service QA deployment name."
  value       = local.qr_access_service_name
}

output "qr_access_service_image" {
  description = "QR Access Service Docker image used in QA."
  value       = var.qr_access_service_image
}

output "qr_access_service_port" {
  description = "QR Access Service QA port."
  value       = var.qr_access_service_port
}

output "qr_access_service_health_path" {
  description = "QR Access Service health check path."
  value       = "/health"
}

output "qr_access_service_metrics_path" {
  description = "QR Access Service Prometheus metrics path."
  value       = "/metrics"
}

output "qr_access_docker_compose_services" {
  description = "Lightweight Docker Compose services required by QR Access in QA."
  value       = local.qr_access_docker_compose_services
}
