############################################
# ALB
############################################
resource "aws_security_group" "alb" {
  name   = "${var.project_name}-${var.environment}-alb-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "HTTP public access"
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
    description     = "Gateway from ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "Gateway metrics from Monitoring"
    from_port       = 3000
    to_port         = 3000
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
    description     = "Debug Gateway from Bastion"
    from_port       = 3000
    to_port         = 3000
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
# WEB APP
############################################
resource "aws_security_group" "web" {
  name   = "${var.project_name}-${var.environment}-web-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "Web from ALB"
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

  ingress {
    description     = "Debug Web from Bastion"
    from_port       = 3003
    to_port         = 3003
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
# CORE 1: AUTH + LIBRARY + INCIDENT
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
    description     = "Incident from Gateway"
    from_port       = 3020
    to_port         = 3020
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Services metrics from Monitoring"
    from_port       = 3001
    to_port         = 3020
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
    description     = "Debug Core1 services from Bastion"
    from_port       = 3001
    to_port         = 3020
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
# CORE 3: QR + TRANSPORT + SPACE
############################################
resource "aws_security_group" "core3" {
  name   = "${var.project_name}-${var.environment}-core3-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "QR Access from Gateway"
    from_port       = 3021
    to_port         = 3021
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

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
    description     = "Services metrics from Monitoring"
    from_port       = 3021
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
    description     = "Debug Core3 services from Bastion"
    from_port       = 3021
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
# CORE 4: KAFKA + ANNOUNCEMENT + EVENT
############################################
resource "aws_security_group" "core4" {
  name   = "${var.project_name}-${var.environment}-core4-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "Kafka external listener from VPC"
    from_port   = 9092
    to_port     = 9092
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  ingress {
    description = "Kafka internal listener from VPC"
    from_port   = 29092
    to_port     = 29092
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  ingress {
    description = "Zookeeper from VPC"
    from_port   = 2181
    to_port     = 2181
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  ingress {
    description     = "Announcement from Gateway"
    from_port       = 3007
    to_port         = 3007
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Event from Gateway"
    from_port       = 3030
    to_port         = 3030
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description     = "Announcement metrics from Monitoring"
    from_port       = 3007
    to_port         = 3007
    protocol        = "tcp"
    security_groups = [aws_security_group.monitoring.id]
  }

  ingress {
    description     = "Event metrics from Monitoring"
    from_port       = 3030
    to_port         = 3030
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
    description     = "Debug Core4 services from Bastion"
    from_port       = 2181
    to_port         = 9092
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Debug Event service from Bastion"
    from_port       = 3030
    to_port         = 3030
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Debug Kafka internal listener from Bastion"
    from_port       = 29092
    to_port         = 29092
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
# CORE 5: WORKFLOW + N8N
############################################
resource "aws_security_group" "core5" {
  name   = "${var.project_name}-${var.environment}-core5-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "Workflow from Gateway"
    from_port       = 3024
    to_port         = 3024
    protocol        = "tcp"
    security_groups = [aws_security_group.gateway.id]
  }

  ingress {
    description = "n8n from VPC"
    from_port   = 5678
    to_port     = 5678
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  ingress {
    description     = "Workflow metrics from Monitoring"
    from_port       = 3024
    to_port         = 3024
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
    description     = "Debug Workflow and n8n from Bastion"
    from_port       = 3024
    to_port         = 5678
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
    description = "Redis from VPC"
    from_port   = 6379
    to_port     = 6379
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
    description     = "Debug Notification from Bastion"
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