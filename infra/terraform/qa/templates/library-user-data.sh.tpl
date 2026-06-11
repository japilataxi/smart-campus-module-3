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

docker compose up -d