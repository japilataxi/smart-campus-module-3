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

resource "aws_instance" "auth" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_a.id
  vpc_security_group_ids = [aws_security_group.auth.id]
  key_name               = var.key_name

  user_data = templatefile("${path.module}/templates/auth-user-data.sh.tpl", {
    compose_content = file("${path.module}/../../docker/docker-compose.auth.qa.yml")
  })

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

  user_data = templatefile("${path.module}/templates/auth-user-data.sh.tpl", {
    compose_content = file("${path.module}/../../docker/docker-compose.library.qa.yml")
  })

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

  user_data = templatefile("${path.module}/templates/gateway-user-data.sh.tpl", {
    auth_private_ip    = aws_instance.auth.private_ip
    library_private_ip = aws_instance.library.private_ip
    compose_content    = file("${path.module}/../../docker/docker-compose.gateway.qa.yml")
  })

  depends_on = [
    aws_instance.auth,
    aws_instance.library
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

  user_data = templatefile("${path.module}/templates/web-user-data.sh.tpl", {
    alb_dns         = aws_lb.app.dns_name
    compose_content = file("${path.module}/../../docker/docker-compose.web.qa.yml")
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-web-app"
  }
}