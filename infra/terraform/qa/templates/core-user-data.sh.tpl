#!/bin/bash
set -eux

yum update -y
yum install -y docker git --allowerasing

systemctl enable docker
systemctl start docker

# Instalar Docker Compose
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 \
-o /usr/local/lib/docker/cli-plugins/docker-compose

chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

mkdir -p /opt/smart-campus
cd /opt/smart-campus

# Variables de entorno
cat > .env <<EOF
RABBITMQ_HOST=${rabbitmq_private_ip}
RABBITMQ_URL=amqp://guest:guest@${rabbitmq_private_ip}:5672
EOF

# Docker Compose
cat > docker-compose.yml <<'EOF'
${compose_content}
EOF

docker compose --env-file .env up -d