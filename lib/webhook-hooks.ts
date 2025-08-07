import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { webhookApi, WebhookData, CreateWebhookRequest, UpdateWebhookRequest } from './webhook-client';

// Query keys
export const webhookKeys = {
  all: ['webhooks'] as const,
  lists: () => [...webhookKeys.all, 'list'] as const,
  list: (filters: string) => [...webhookKeys.lists(), { filters }] as const,
  details: () => [...webhookKeys.all, 'detail'] as const,
  detail: (id: string) => [...webhookKeys.details(), id] as const,
  deliveries: (id: string) => [...webhookKeys.detail(id), 'deliveries'] as const,
  stats: () => [...webhookKeys.all, 'stats'] as const,
};

// Hooks for webhook management
export const useWebhooks = () => {
  return useQuery({
    queryKey: webhookKeys.lists(),
    queryFn: webhookApi.getWebhooks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWebhook = (id: string) => {
  return useQuery({
    queryKey: webhookKeys.detail(id),
    queryFn: () => webhookApi.getWebhook(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWebhookDeliveries = (id: string) => {
  return useQuery({
    queryKey: webhookKeys.deliveries(id),
    queryFn: () => webhookApi.getWebhookDeliveries(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds (more frequent updates for deliveries)
  });
};

export const useWebhookStats = () => {
  return useQuery({
    queryKey: webhookKeys.stats(),
    queryFn: webhookApi.getWebhookStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutations
export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: webhookApi.createWebhook,
    onSuccess: () => {
      // Invalidate and refetch webhooks list
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: webhookKeys.stats() });
    },
  });
};

export const useUpdateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, webhook }: { id: string; webhook: UpdateWebhookRequest }) =>
      webhookApi.updateWebhook(id, webhook),
    onSuccess: (data) => {
      // Update the specific webhook in cache
      queryClient.setQueryData(webhookKeys.detail(data.id), data);
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: webhookKeys.stats() });
    },
  });
};

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: webhookApi.deleteWebhook,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: webhookKeys.detail(deletedId) });
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: webhookKeys.stats() });
    },
  });
};

export const useTestWebhook = () => {
  return useMutation({
    mutationFn: webhookApi.testWebhook,
    // Don't invalidate queries for test operations
  });
}; 