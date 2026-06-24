############################################
# MONITORING (Prometheus / Grafana)
############################################
resource "aws_security_group" "monitoring" {
  name   = "${var.project_name}-${var.environment}-monitoring-sg"
  vpc_id = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

############################################
# NOTIFICATION (FALTANTE)
############################################
resource "aws_security_group" "notification" {
  name   = "${var.project_name}-${var.environment}-notification-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3010
    to_port         = 3010
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Allow notification port from bastion for Swagger tunnel"
    from_port       = 3010
    to_port         = 3010
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Metrics from monitoring"
    from_port       = 3010
    to_port         = 3010
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
# GATEWAY
############################################
resource "aws_security_group" "gateway" {
  name   = "${var.project_name}-${var.environment}-gateway-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "Allow gateway port from bastion for SSH tunnel"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Metrics from monitoring"
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
# AUTH (con metrics)
############################################
resource "aws_security_group" "auth" {
  name   = "${var.project_name}-${var.environment}-auth-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "Allow auth port from bastion for Swagger tunnel"
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  # METRICS
  ingress {
    description     = "Metrics from monitoring"
    from_port       = 3001
    to_port         = 3001
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
# LIBRARY (metrics)
############################################
resource "aws_security_group" "library" {
  name   = "${var.project_name}-${var.environment}-library-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3002
    to_port         = 3002
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Allow library port from bastion for Swagger tunnel"
    from_port       = 3002
    to_port         = 3002
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  # METRICS
  ingress {
    description     = "Metrics from monitoring"
    from_port       = 3002
    to_port         = 3002
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
# WEB
############################################
resource "aws_security_group" "web" {
  name   = "${var.project_name}-${var.environment}-web-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3003
    to_port         = 3003
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
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
# INCIDENT (metrics)
############################################
resource "aws_security_group" "incident" {
  name   = "${var.project_name}-${var.environment}-incident-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3020
    to_port         = 3020
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Allow incident port from bastion for Swagger tunnel"
    from_port       = 3020
    to_port         = 3020
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  # METRICS
  ingress {
    description     = "Metrics from monitoring"
    from_port       = 3020
    to_port         = 3020
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
# QR ACCESS (metrics)
############################################
resource "aws_security_group" "qr_access" {
  name   = "${var.project_name}-${var.environment}-qr-access-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3021
    to_port         = 3021
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  # METRICS
  ingress {
    description     = "Metrics from monitoring"
    from_port       = 3021
    to_port         = 3021
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
# TRANSPORT (metrics)
############################################
resource "aws_security_group" "transport" {
  name   = "${var.project_name}-${var.environment}-transport-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3022
    to_port         = 3022
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Allow transport port from bastion for Swagger tunnel"
    from_port       = 3022
    to_port         = 3022
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  # METRICS
  ingress {
    description     = "Metrics from monitoring"
    from_port       = 3022
    to_port         = 3022
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
# SPACE AVAILABILITY (metrics)
############################################
resource "aws_security_group" "space_availability" {
  name   = "${var.project_name}-${var.environment}-space-availability-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3023
    to_port         = 3023
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Allow space availability port from bastion for Swagger tunnel"
    from_port       = 3023
    to_port         = 3023
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  # METRICS
  ingress {
    description     = "Metrics from monitoring"
    from_port       = 3023
    to_port         = 3023
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
# RABBITMQ (actualizado)
############################################
resource "aws_security_group" "rabbitmq" {
  name   = "${var.project_name}-${var.environment}-rabbitmq-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "RabbitMQ AMQP from services"
    from_port   = 5672
    to_port     = 5672
    protocol    = "tcp"
    security_groups = [
      aws_security_group.auth.id,
      aws_security_group.library.id,
      aws_security_group.incident.id,
      aws_security_group.notification.id,
      aws_security_group.qr_access.id,
      aws_security_group.transport.id,
      aws_security_group.space_availability.id
    ]
  }

  ingress {
    description     = "RabbitMQ management from bastion"
    from_port       = 15672
    to_port         = 15672
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "SSH from bastion"
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