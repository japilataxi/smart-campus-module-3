output "bastion_public_ip" {
  value = aws_instance.bastion.public_ip
}

output "alb_dns_name" {
  value = aws_lb.app.dns_name
}

output "api_gateway_private_ip" {
  value = aws_instance.gateway.private_ip
}

output "auth_service_private_ip" {
  value = aws_instance.auth.private_ip
}

output "library_service_private_ip" {
  value = aws_instance.library.private_ip
}

output "web_app_private_ip" {
  value = aws_instance.web.private_ip
}

output "campus_incident_service_private_ip" {
  value = aws_instance.incident.private_ip
}
output "qr_access_service_private_ip" {
  value = aws_instance.qr_access.private_ip
}
