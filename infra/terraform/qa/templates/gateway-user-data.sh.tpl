#!/bin/bash
set -eux

yum update -y
yum install -y docker git

systemctl enable docker
systemctl start docker

mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

mkdir -p /opt/smart-campus
cd /opt/smart-campus

cat > docker-compose.yml <<'EOF'
${compose_content}
EOF
cat > .env <<EOF
CORS_ORIGIN=http://${alb_dns}
AUTH_SERVICE_URL=http://${auth_private_ip}:3001
LIBRARY_SERVICE_URL=http://${library_private_ip}:3002
CAMPUS_INCIDENT_SERVICE_URL=http://${incident_private_ip}:3020
QR_ACCESS_SERVICE_URL=http://${qr_access_private_ip}:3021
EOF

docker compose up -d