output "alb_dns_name" {
  value = aws_lb.app.dns_name
}

output "bastion_public_ip" {
  value = aws_instance.bastion.public_ip
}

output "gateway_private_ip" {
  value = aws_instance.gateway.private_ip
}

output "web_private_ip" {
  value = aws_instance.web.private_ip
}

output "core1_private_ip" {
  description = "Auth + Library EC2 private IP"
  value       = aws_instance.core1.private_ip
}

output "core2_private_ip" {
  description = "Campus Incident + QR Access EC2 private IP"
  value       = aws_instance.core2.private_ip
}

output "core3_private_ip" {
  description = "Transport + Space Availability EC2 private IP"
  value       = aws_instance.core3.private_ip
}

output "monitoring_private_ip" {
  description = "Notification + RabbitMQ + Monitoring EC2 private IP"
  value       = aws_instance.monitoring.private_ip
}