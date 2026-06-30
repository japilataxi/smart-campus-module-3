############################################
# ALB
############################################
resource "aws_security_group" "alb" {
  name   = "${var.project_name}-${var.environment}-alb-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

############################################
# BASTION
############################################
resource "aws_security_group" "bastion" {
  name   = "${var.project_name}-${var.environment}-bastion-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "SSH from my IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

############################################
# API GATEWAY
############################################
resource "aws_security_group" "gateway" {
  name   = "${var.project_name}-${var.environment}-gateway-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "API Gateway from ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "SSH from Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Metrics from Monitoring"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.monitoring.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

############################################
# WEB APP
############################################
resource "aws_security_group" "web" {
  name   = "${var.project_name}-${var.environment}-web-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "Web App from ALB"
    from_port       = 3003
    to_port         = 3003
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "SSH from Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

############################################
# CORE 1: AUTH + LIBRARY
############################################
resource "aws_security_group" "core1" {
  name   = "${var.project_name}-${var.environment}-core1-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "Auth from Gateway"
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Library from Gateway"
    from_port       = 3002
    to_port         = 3002
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Auth metrics from Monitoring"
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.monitoring.id]
  }

  ingress {
    description     = "Library metrics from Monitoring"
    from_port       = 3002
    to_port         = 3002
    protocol        = "tcp"
    security_groups = [aws_security_group.monitoring.id]
  }

  ingress {
    description     = "SSH from Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Auth Swagger from Bastion"
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Library Swagger from Bastion"
    from_port       = 3002
    to_port         = 3002
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

############################################
# CORE 2: INCIDENT + QR ACCESS
############################################
resource "aws_security_group" "core2" {
  name   = "${var.project_name}-${var.environment}-core2-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "Incident from Gateway"
    from_port       = 3020
    to_port         = 3020
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "QR Access from Gateway"
    from_port       = 3021
    to_port         = 3021
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Incident metrics from Monitoring"
    from_port       = 3020
    to_port         = 3020
    protocol        = "tcp"
    security_groups = [aws_security_group.monitoring.id]
  }

  ingress {
    description     = "QR Access metrics from Monitoring"
    from_port       = 3021
    to_port         = 3021
    protocol        = "tcp"
    security_groups = [aws_security_group.monitoring.id]
  }

  ingress {
    description     = "SSH from Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
  description     = "Incident Swagger from Bastion"
  from_port       = 3020
  to_port         = 3020
  protocol        = "tcp"
  security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "QR Swagger from Bastion"
    from_port       = 3021
    to_port         = 3021
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

############################################
# CORE 3: TRANSPORT + SPACE
############################################
resource "aws_security_group" "core3" {
  name   = "${var.project_name}-${var.environment}-core3-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "Transport from Gateway"
    from_port       = 3022
    to_port         = 3022
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Space Availability from Gateway"
    from_port       = 3023
    to_port         = 3023
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Transport metrics from Monitoring"
    from_port       = 3022
    to_port         = 3022
    protocol        = "tcp"
    security_groups = [aws_security_group.monitoring.id]
  }

  ingress {
    description     = "Space metrics from Monitoring"
    from_port       = 3023
    to_port         = 3023
    protocol        = "tcp"
    security_groups = [aws_security_group.monitoring.id]
  }

  ingress {
    description     = "SSH from Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Transport Swagger from Bastion"
    from_port       = 3022
    to_port         = 3022
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Space Swagger from Bastion"
    from_port       = 3023
    to_port         = 3023
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

############################################
# MONITORING + NOTIFICATION + RABBITMQ
############################################
resource "aws_security_group" "monitoring" {
  name   = "${var.project_name}-${var.environment}-monitoring-sg"
  vpc_id = aws_vpc.main.id

  ingress {
  description = "Notification from VPC"
  from_port   = 3010
  to_port     = 3010
  protocol    = "tcp"
  cidr_blocks = [aws_vpc.main.cidr_block]
  }

  ingress {
    description = "RabbitMQ AMQP from VPC"
    from_port   = 5672
    to_port     = 5672
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  ingress {
    description     = "Prometheus from Bastion"
    from_port       = 9090
    to_port         = 9090
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Grafana from Bastion"
    from_port       = 3005
    to_port         = 3005
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "RabbitMQ Management from Bastion"
    from_port       = 15672
    to_port         = 15672
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "SSH from Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Notification Swagger from Bastion"
    from_port       = 3010
    to_port         = 3010
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}