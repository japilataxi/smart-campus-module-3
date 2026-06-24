data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
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

resource "aws_instance" "rabbitmq" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.rabbitmq.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/service-user-data.sh.tpl", {
    compose_content = file("${path.module}/../../docker/docker-compose.rabbitmq.qa.yml")
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-rabbitmq"
  }
}

resource "aws_instance" "auth" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.auth.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/auth-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.auth.qa.yml")
    rabbitmq_private_ip = aws_instance.rabbitmq.private_ip
  })

  depends_on = [
    aws_instance.rabbitmq
  ]
  tags = {
    Name = "${var.project_name}-${var.environment}-auth-service"
  }
}

resource "aws_instance" "library" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_b.id
  vpc_security_group_ids = [aws_security_group.library.id]
  key_name               = var.key_name


  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/auth-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.library.qa.yml")
    rabbitmq_private_ip = aws_instance.rabbitmq.private_ip
  })
  depends_on = [
    aws_instance.rabbitmq
  ]
  tags = {
    Name = "${var.project_name}-${var.environment}-library-service"
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
    auth_private_ip               = aws_instance.auth.private_ip
    library_private_ip            = aws_instance.library.private_ip
    incident_private_ip           = aws_instance.incident.private_ip
    notification_private_ip       = aws_instance.notification.private_ip
    qr_access_private_ip          = aws_instance.qr_access.private_ip
    transport_private_ip          = aws_instance.transport.private_ip
    space_availability_private_ip = aws_instance.space_availability.private_ip
    alb_dns                       = aws_lb.app.dns_name
    compose_content               = file("${path.module}/../../docker/docker-compose.gateway.qa.yml")
  })

  depends_on = [
    aws_instance.auth,
    aws_instance.library,
    aws_instance.incident,
    aws_instance.qr_access,
    aws_instance.notification,
    aws_instance.transport,
    aws_instance.space_availability
  ]

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

resource "aws_instance" "incident" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.incident.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/incident-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.incident.qa.yml")
    rabbitmq_private_ip = aws_instance.rabbitmq.private_ip
  })

  depends_on = [
    aws_instance.rabbitmq
  ]

  tags = {
    Name = "${var.project_name}-${var.environment}-campus-incident-service"
  }
}

resource "aws_instance" "notification" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.notification.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/notification-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.notification.qa.yml")
    rabbitmq_private_ip = aws_instance.rabbitmq.private_ip
  })

  depends_on = [
    aws_instance.rabbitmq
  ]

  tags = {
    Name = "${var.project_name}-${var.environment}-notification-service"
  }
}

resource "aws_instance" "qr_access" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_b.id
  vpc_security_group_ids = [aws_security_group.qr_access.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/qr-access-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.qr-access.qa.yml")
    rabbitmq_private_ip = aws_instance.rabbitmq.private_ip
  })

  depends_on = [
    aws_instance.rabbitmq
  ]

  tags = {
    Name = "${var.project_name}-${var.environment}-qr-access-service"
  }
}

resource "aws_instance" "transport" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.transport.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/transport-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.transport.qa.yml")
    rabbitmq_private_ip = aws_instance.rabbitmq.private_ip
  })

  depends_on = [
    aws_instance.rabbitmq
  ]

  tags = {
    Name = "${var.project_name}-${var.environment}-transport-service"
  }
}

resource "aws_instance" "space_availability" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_b.id
  vpc_security_group_ids = [aws_security_group.space_availability.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/templates/space-availability-user-data.sh.tpl", {
    compose_content     = file("${path.module}/../../docker/docker-compose.space-availability.qa.yml")
    rabbitmq_private_ip = aws_instance.rabbitmq.private_ip
  })

  depends_on = [
    aws_instance.rabbitmq
  ]

  tags = {
    Name = "${var.project_name}-${var.environment}-space-availability-service"
  }
}

resource "aws_instance" "monitoring" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.monitoring.id]
  key_name               = var.key_name

  user_data = templatefile("${path.module}/templates/monitoring-user-data.sh.tpl", {
    compose_content = file("${path.module}/../../docker/docker-compose.monitoring.qa.yml")

    prometheus_content = templatefile("${path.module}/../../monitoring/prometheus.yml.tpl", {
      api_gateway_private_ip        = aws_instance.gateway.private_ip
      auth_private_ip               = aws_instance.auth.private_ip
      library_private_ip            = aws_instance.library.private_ip
      incident_private_ip           = aws_instance.incident.private_ip
      notification_private_ip       = aws_instance.notification.private_ip
      qr_access_private_ip          = aws_instance.qr_access.private_ip
      transport_private_ip          = aws_instance.transport.private_ip
      space_availability_private_ip = aws_instance.space_availability.private_ip
    })
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-monitoring"
  }
}