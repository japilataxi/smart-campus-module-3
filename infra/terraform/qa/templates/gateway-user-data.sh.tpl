#!/bin/bash
set -eux

yum update -y
yum install -y docker git

systemctl enable docker
systemctl start docker

mkdir -p /opt/smart-campus
cd /opt/smart-campus

cat > docker-compose.yml <<'EOF'
${compose_content}
EOF

export CORS_ORIGIN="http://${alb_dns}"
export AUTH_SERVICE_URL="http://${auth_private_ip}:3001"
export LIBRARY_SERVICE_URL="http://${library_private_ip}:3002"
export CAMPUS_SERVICE_URL="http://${campus_private_ip}:3020"

docker compose up -d
