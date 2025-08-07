import apiClient from './api-client';

// Webhook types based on backend
export interface WebhookData {
  id: string;
  name: string;
  url: string;
  events: string[];
  headers?: Record<string, string>;
  isActive: boolean;
  secret?: string;
  retryConfig: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookRequest {
  name: string;
  url: string;
  events: string[];
  headers?: Record<string, string>;
  secret?: string;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
}

export interface UpdateWebhookRequest {
  name?: string;
  url?: string;
  events?: string[];
  headers?: Record<string, string>;
  isActive?: boolean;
  secret?: string;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  eventType: string;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  lastAttemptAt?: string;
  deliveredAt?: string;
  errorMessage?: string;
  correlationId: string;
  createdAt: string;
}

export interface TestWebhookResult {
  success: boolean;
  statusCode?: number;
  responseTime?: number;
  errorMessage?: string;
}

export interface WebhookStats {
  totalWebhooks: number;
  activeWebhooks: number;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  averageResponseTime: number;
}

// Webhook API functions
export const webhookApi = {
  // Get all webhooks
  getWebhooks: async (): Promise<WebhookData[]> => {
    const response = await apiClient.get('/webhooks');
    return response.data.data || [];
  },

  // Get webhook by ID
  getWebhook: async (id: string): Promise<WebhookData> => {
    const response = await apiClient.get(`/webhooks/${id}`);
    return response.data.data;
  },

  // Create new webhook
  createWebhook: async (webhook: CreateWebhookRequest): Promise<WebhookData> => {
    const response = await apiClient.post('/webhooks', webhook);
    return response.data.data;
  },

  // Update webhook
  updateWebhook: async (id: string, webhook: UpdateWebhookRequest): Promise<WebhookData> => {
    const response = await apiClient.put(`/webhooks/${id}`, webhook);
    return response.data.data;
  },

  // Delete webhook
  deleteWebhook: async (id: string): Promise<void> => {
    await apiClient.delete(`/webhooks/${id}`);
  },

  // Test webhook
  testWebhook: async (id: string): Promise<TestWebhookResult> => {
    const response = await apiClient.post(`/webhooks/${id}/test`);
    return response.data.data;
  },

  // Get webhook deliveries
  getWebhookDeliveries: async (id: string): Promise<WebhookDelivery[]> => {
    const response = await apiClient.get(`/webhooks/${id}/deliveries`);
    return response.data.data || [];
  },

  // Get webhook statistics
  getWebhookStats: async (): Promise<WebhookStats> => {
    const response = await apiClient.get('/webhooks/stats');
    return response.data.data;
  }
}; 