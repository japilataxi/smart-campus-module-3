global:
  scrape_interval: 15s

scrape_configs:
  - job_name: api-gateway
    metrics_path: /metrics
    static_configs:
      - targets: ["${api_gateway_private_ip}:3000"]

  - job_name: auth-service
    metrics_path: /metrics
    static_configs:
      - targets: ["${auth_private_ip}:3001"]

  - job_name: library-service
    metrics_path: /metrics
    static_configs:
      - targets: ["${library_private_ip}:3002"]

  - job_name: campus-incident-service
    metrics_path: /metrics
    static_configs:
      - targets: ["${incident_private_ip}:3020"]

  - job_name: notification-service
    metrics_path: /metrics
    static_configs:
      - targets: ["${notification_private_ip}:3010"]

  - job_name: qr-access-service
    metrics_path: /metrics
    static_configs:
      - targets: ["${qr_access_private_ip}:3021"]

  - job_name: transport-service
    metrics_path: /metrics
    static_configs:
      - targets: ["${transport_private_ip}:3022"]

  - job_name: space-availability-service
    metrics_path: /metrics
    static_configs:
      - targets: ["${space_availability_private_ip}:3023"]