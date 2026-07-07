import { N8nWebhookAdapter } from './n8n-webhook.adapter';

describe('N8nWebhookAdapter', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.N8N_INCIDENT_WEBHOOK_URL = 'http://n8n.test/webhook/incident';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('sends payload to configured webhook URL', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue('{"received":true}'),
    } as any);

    const adapter = new N8nWebhookAdapter();
    const result = await adapter.send('incident-created-workflow', { id: '1' });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://n8n.test/webhook/incident',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result.status).toBe(200);
  });
});
