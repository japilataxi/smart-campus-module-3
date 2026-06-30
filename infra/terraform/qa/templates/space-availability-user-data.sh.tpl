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
RABBITMQ_URL=amqp://guest:guest@${rabbitmq_private_ip}:5672
EOF

docker compose up -d