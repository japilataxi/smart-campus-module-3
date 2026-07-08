# Workflow Service

`workflow-service` connects Smart Campus business events with n8n automation workflows.

## Responsibilities

- Trigger n8n workflows from REST events.
- Store workflow execution records in PostgreSQL.
- Cache recent workflow results, idempotency keys, and retry counters in Redis.
- Expose execution history through API Gateway.
- Protect manual workflow triggers with JWT and admin RBAC.

## Gateway Routes

The API Gateway exposes:

- `POST /api/workflows/trigger`
- `POST /api/workflows/incident-created`
- `POST /api/workflows/user-registered`
- `POST /api/workflows/library-loan-created`
- `POST /api/workflows/critical-notification`
- `GET /api/workflows/executions`
- `GET /api/workflows/executions/:id`

## n8n Workflows

Required n8n webhook workflows:

- `incident-created-workflow`
- `user-registered-workflow`
- `library-loan-created-workflow`
- `critical-notification-workflow`

Each webhook receives a payload with `executionId`, `workflowName`, `sourceService`, `eventType`, `triggeredByUserId`, `payload`, and `occurredAt`.

## Observability

- Health: `/health`
- Metrics: `/metrics`
- Swagger: `/docs`

Custom Prometheus metrics:

- `workflow_executions_total`
- `workflow_executions_success_total`
- `workflow_executions_failed_total`
- `workflow_execution_duration_seconds`
- `n8n_webhook_requests_total`
