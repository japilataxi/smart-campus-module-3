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


resource "aws_instance" "core1" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.core1.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/core-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.core1.qa.yml")
    rabbitmq_private_ip = aws_instance.monitoring.private_ip
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-core1-auth-library"
  }
}

resource "aws_instance" "core2" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_b.id
  vpc_security_group_ids = [aws_security_group.core2.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/core-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.core2.qa.yml")
    rabbitmq_private_ip = aws_instance.monitoring.private_ip
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-core2-incident-qr"
  }
}

resource "aws_instance" "core3" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.core3.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/core-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.core3.qa.yml")
    rabbitmq_private_ip = aws_instance.monitoring.private_ip
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-core3-transport-space"
  }
}


resource "aws_instance" "gateway" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.gateway.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/gateway-user-data.sh.tpl", {
    auth_private_ip               = aws_instance.core1.private_ip
    library_private_ip            = aws_instance.core1.private_ip
    incident_private_ip           = aws_instance.core2.private_ip
    notification_private_ip       = aws_instance.monitoring.private_ip
    qr_access_private_ip          = aws_instance.core2.private_ip
    transport_private_ip          = aws_instance.core3.private_ip
    space_availability_private_ip = aws_instance.core3.private_ip
    alb_dns                       = aws_lb.app.dns_name
    compose_content               = file("${path.module}/../../docker/docker-compose.gateway.qa.yml")
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-api-gateway"
  }
}

resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_b.id
  vpc_security_group_ids = [aws_security_group.web.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/web-user-data.sh.tpl", {
    alb_dns         = aws_lb.app.dns_name
    compose_content = file("${path.module}/../../docker/docker-compose.web.qa.yml")
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-web-app"
  }
}


resource "aws_instance" "monitoring" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.monitoring.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/monitoring-user-data.sh.tpl", {
    compose_content = file("${path.module}/../../docker/docker-compose.monitoring.qa.yml")

    prometheus_content = <<EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: notification-service
    metrics_path: /metrics
    static_configs:
      - targets: ['localhost:3010']
EOF
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-monitoring-notification-rabbitmq"
  }
}