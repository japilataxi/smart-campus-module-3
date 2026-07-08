import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { WorkflowName } from '../../domain/enums/workflow-name.enum';
import { N8nWebhookPort } from '../../application/ports/n8n-webhook.port';

@Injectable()
export class N8nWebhookAdapter implements N8nWebhookPort {
  private readonly webhookMap: Record<string, string | undefined> = {
    [WorkflowName.IncidentCreated]: process.env.N8N_INCIDENT_WEBHOOK_URL,
    [WorkflowName.UserRegistered]: process.env.N8N_USER_REGISTERED_WEBHOOK_URL,
    [WorkflowName.LibraryLoanCreated]: process.env.N8N_LIBRARY_LOAN_WEBHOOK_URL,
    [WorkflowName.CriticalNotification]: process.env.N8N_CRITICAL_NOTIFICATION_WEBHOOK_URL,
  };

  async send(workflowName: string, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
    const webhookUrl = this.webhookMap[workflowName];

    if (!webhookUrl) {
      throw new ServiceUnavailableException(`Missing n8n webhook URL for ${workflowName}`);
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let parsed: Record<string, unknown> = { raw: text };

    try {
      parsed = text ? (JSON.parse(text) as Record<string, unknown>) : { ok: response.ok };
    } catch {
      parsed = { raw: text };
    }

    if (!response.ok) {
      throw new ServiceUnavailableException({
        message: 'n8n webhook request failed',
        status: response.status,
        response: parsed,
      });
    }

    return {
      status: response.status,
      workflowName,
      response: parsed,
    };
  }
}
