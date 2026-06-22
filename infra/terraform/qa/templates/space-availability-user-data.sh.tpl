#!/bin/bash
set -euo pipefail

dnf update -y
dnf install -y docker
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

mkdir -p /opt/smart-campus
cat > /opt/smart-campus/docker-compose.yml <<'COMPOSE'
${compose_content}
COMPOSE

cd /opt/smart-campus
docker compose pull
docker compose up -d
