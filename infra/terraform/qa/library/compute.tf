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

resource "aws_instance" "library_service" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.private_a.id
  vpc_security_group_ids      = [aws_security_group.library_service.id]
  key_name                    = var.key_name
  associate_public_ip_address = false

  user_data = <<-EOF
    #!/bin/bash
    set -eux

    yum update -y
    yum install -y docker

    systemctl enable docker
    systemctl start docker

    docker network create smart-campus-network || true
    docker volume create library_db_data || true

    docker rm -f library-db || true
    docker run -d \
      --name library-db \
      --network smart-campus-network \
      -e POSTGRES_DB=library_db \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=postgres \
      -v library_db_data:/var/lib/postgresql/data \
      postgres:16

    sleep 30

    docker pull japilataxi/library-service:latest

    docker rm -f library-service || true
    docker run -d \
      --name library-service \
      --network smart-campus-network \
      -p 3001:3001 \
      -e DB_HOST=library-db \
      -e DB_PORT=5432 \
      -e DB_USERNAME=postgres \
      -e DB_PASSWORD=postgres \
      -e DB_NAME=library_db \
      -e JWT_SECRET=smart-campus-library-secret \
      -e JWT_EXPIRES_IN=8h \
      japilataxi/library-service:latest
  EOF

  tags = {
    Name = "${var.project_name}-${var.environment}-library-service"
  }
}