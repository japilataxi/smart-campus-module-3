#!/bin/bash
set -eux

yum update -y
yum install -y docker git --allowerasing

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
COMPOSE_PROJECT_NAME=smart-campus-gateway
CORS_ORIGIN=http://${alb_dns}
AUTH_SERVICE_URL=http://${auth_private_ip}:3001
LIBRARY_SERVICE_URL=http://${library_private_ip}:3002
CAMPUS_INCIDENT_SERVICE_URL=http://${incident_private_ip}:3020
NOTIFICATION_SERVICE_URL=http://${notification_private_ip}:3010
QR_ACCESS_SERVICE_URL=http://${qr_access_private_ip}:3021
TRANSPORT_SERVICE_URL=http://${transport_private_ip}:3022
SPACE_AVAILABILITY_SERVICE_URL=http://${space_availability_private_ip}:3023
WORKFLOW_SERVICE_URL=http://${workflow_private_ip}:3024
ANNOUNCEMENT_SERVICE_URL=http://${announcement_private_ip}:3007
EVENT_SERVICE_URL=http://${event_private_ip}:3030
EOF

docker compose down || true
docker compose up -d