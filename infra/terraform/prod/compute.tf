data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-kernel-6.1-x86_64"]
  }
}

resource "aws_instance" "bastion" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.public_a.id
  vpc_security_group_ids      = [aws_security_group.bastion.id]
  key_name                    = var.key_name
  associate_public_ip_address = true

  tags = {
    Name = "${var.project_name}-${var.environment}-bastion"
  }
}

resource "aws_instance" "gateway" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  private_ip             = "10.20.11.10"
  vpc_security_group_ids = [aws_security_group.gateway.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/gateway-user-data.sh.tpl", {
    auth_private_ip               = "10.20.11.20"
    library_private_ip            = "10.20.11.20"
    incident_private_ip           = "10.20.11.20"
    notification_private_ip       = "10.20.11.60"
    qr_access_private_ip          = "10.20.12.30"
    transport_private_ip          = "10.20.12.30"
    space_availability_private_ip = "10.20.12.30"
    workflow_private_ip           = "10.20.12.50"
    announcement_private_ip       = "10.20.11.40"
    event_private_ip              = "10.20.11.40"
    alb_dns                       = aws_lb.app.dns_name
    compose_content               = file("${path.module}/../../docker/docker-compose.gateway.prod.yml")
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-api-gateway"
  }
}

resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_b.id
  private_ip             = "10.20.12.10"
  vpc_security_group_ids = [aws_security_group.web.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/web-user-data.sh.tpl", {
    alb_dns         = aws_lb.app.dns_name
    compose_content = file("${path.module}/../../docker/docker-compose.web.prod.yml")
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-web-app"
  }
}

resource "aws_instance" "core1" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  private_ip             = "10.20.11.20"
  vpc_security_group_ids = [aws_security_group.core1.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/core-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.core1.prod.yml")
    rabbitmq_private_ip = "10.20.11.60"
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-core1-auth-library-incident"
  }
}

resource "aws_instance" "core3" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_b.id
  private_ip             = "10.20.12.30"
  vpc_security_group_ids = [aws_security_group.core3.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/core-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.core3.prod.yml")
    rabbitmq_private_ip = "10.20.11.60"
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-core3-qr-transport-space"
  }
}

resource "aws_instance" "core4" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.medium"
  subnet_id              = aws_subnet.private_a.id
  private_ip             = "10.20.11.40"
  vpc_security_group_ids = [aws_security_group.core4.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/core-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.core4.prod.yml")
    rabbitmq_private_ip = "10.20.11.60"
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-core4-kafka-announcement-event"
  }
}

resource "aws_instance" "core5" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.small"
  subnet_id              = aws_subnet.private_b.id
  private_ip             = "10.20.12.50"
  vpc_security_group_ids = [aws_security_group.core5.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/core-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.core5.prod.yml")
    rabbitmq_private_ip = "10.20.11.60"
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-core5-workflow-n8n"
  }
}

resource "aws_instance" "monitoring" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.small"
  subnet_id              = aws_subnet.private_a.id
  private_ip             = "10.20.11.60"
  vpc_security_group_ids = [aws_security_group.monitoring.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/monitoring-user-data.sh.tpl", {
    compose_content  = file("${path.module}/../../docker/docker-compose.monitoring.prod.yml")
    kafka_private_ip = "10.20.11.40"

    prometheus_content = <<EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: notification-service
    metrics_path: /metrics
    static_configs:
      - targets: ['localhost:3010']

  - job_name: api-gateway
    metrics_path: /metrics
    static_configs:
      - targets: ['10.20.11.10:3000']

  - job_name: auth-service
    metrics_path: /metrics
    static_configs:
      - targets: ['10.20.11.20:3001']

  - job_name: library-service
    metrics_path: /metrics
    static_configs:
      - targets: ['10.20.11.20:3002']

  - job_name: campus-incident-service
    metrics_path: /metrics
    static_configs:
      - targets: ['10.20.11.20:3020']

  - job_name: qr-access-service
    metrics_path: /metrics
    static_configs:
      - targets: ['10.20.12.30:3021']

  - job_name: transport-service
    metrics_path: /metrics
    static_configs:
      - targets: ['10.20.12.30:3022']

  - job_name: space-availability-service
    metrics_path: /metrics
    static_configs:
      - targets: ['10.20.12.30:3023']

  - job_name: workflow-service
    metrics_path: /metrics
    static_configs:
      - targets: ['10.20.12.50:3024']

  - job_name: announcement-service
    metrics_path: /metrics
    static_configs:
      - targets: ['10.20.11.40:3007']

  - job_name: event-service
    metrics_path: /metrics
    static_configs:
      - targets: ['10.20.11.40:3030']
EOF
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-monitoring-notification-rabbitmq"
  }
}