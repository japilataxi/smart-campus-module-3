export const N8N_WEBHOOK_PORT = Symbol('N8N_WEBHOOK_PORT');

export interface N8nWebhookPort {
  send(workflowName: string, payload: Record<string, unknown>): Promise<Record<string, unknown>>;
}
