# n8n Automation

Smart Campus uses `workflow-service` to integrate business events with n8n webhooks.

## Local n8n

Docker Compose QA includes an n8n container:

- URL: `http://localhost:5678`
- User: `admin`
- Password: `admin`

## Webhook URLs

The default local webhook URLs are:

- `http://n8n:5678/webhook/incident-created-workflow`
- `http://n8n:5678/webhook/user-registered-workflow`
- `http://n8n:5678/webhook/library-loan-created-workflow`
- `http://n8n:5678/webhook/critical-notification-workflow`

## Example Flow

1. `campus-incident-service` creates an incident.
2. The event is sent to `workflow-service` through REST or an event bridge in a future iteration.
3. `workflow-service` stores a pending execution.
4. `workflow-service` calls the configured n8n webhook.
5. n8n sends email, writes to Google Sheets, Slack, or another external system.
6. `workflow-service` stores success or failure execution results.

## Future Extensions

- RabbitMQ/Kafka consumers for asynchronous workflow triggering.
- WebSocket notifications for real-time workflow execution updates.
- More n8n workflow templates for academic, library, security, and transport use cases.
