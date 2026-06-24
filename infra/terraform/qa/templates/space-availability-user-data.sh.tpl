#!/bin/bash
set -euo pipefail

dnf update -y
yum install -y docker git --allowerasing

systemctl enable docker
systemctl start docker

usermod -aG docker ec2-user

# Docker Compose plugin (necesario en AL2023)
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

mkdir -p /opt/smart-campus
cd /opt/smart-campus

# ENV (RabbitMQ obligatorio para microservicios)
cat > .env <<EOF
RABBITMQ_URL=amqp://guest:guest@${rabbitmq_private_ip}:5672
EOF

# Docker compose (IMPORTANTE: sin quotes para interpolación)
cat > docker-compose.yml <<EOF
${compose_content}
EOF

docker compose pull
docker compose up -d