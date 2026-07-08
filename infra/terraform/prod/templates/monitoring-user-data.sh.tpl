#!/bin/bash
set -eux

yum update -y
yum install -y docker git --allowerasing

systemctl enable docker
systemctl start docker

mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 \
-o /usr/local/lib/docker/cli-plugins/docker-compose

chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

mkdir -p /opt/smart-campus
cd /opt/smart-campus

cat > prometheus.yml <<'EOF'
${prometheus_content}
EOF

cat > docker-compose.yml <<'EOF'
${compose_content}
EOF

cat > .env <<EOF
COMPOSE_PROJECT_NAME=smart-campus-monitoring
KAFKA_BROKERS=${kafka_private_ip}:9092
EOF

docker compose --env-file .env down || true
docker compose --env-file .env up -d