output "bastion_public_ip" {
  value = aws_instance.bastion.public_ip
}

output "alb_dns_name" {
  value = aws_lb.app.dns_name
}

output "api_gateway_private_ip" {
  value = aws_instance.gateway.private_ip
}

output "auth_private_ip" {
  value = aws_instance.auth.private_ip
}

output "library_private_ip" {
  value = aws_instance.library.private_ip
}

output "web_private_ip" {
  value = aws_instance.web.private_ip
}

output "incident_private_ip" {
  value = aws_instance.incident.private_ip
}

output "notification_private_ip" {
  value = aws_instance.notification.private_ip
}

output "qr_access_private_ip" {
  value = aws_instance.qr_access.private_ip
}

output "transport_private_ip" {
  value = aws_instance.transport.private_ip
}

output "space_availability_private_ip" {
  value = aws_instance.space_availability.private_ip
}