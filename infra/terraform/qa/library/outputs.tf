output "bastion_public_ip" {
  value = aws_instance.bastion.public_ip
}

output "library_service_private_ip" {
  value = aws_instance.library_service.private_ip
}

output "library_service_alb_dns" {
  value = aws_lb.library.dns_name
}

output "library_service_health_url" {
  value = "http://${aws_lb.library.dns_name}/health"
}

output "library_service_swagger_url" {
  value = "http://${aws_lb.library.dns_name}/api/docs"
}