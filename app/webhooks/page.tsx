'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NavigationMenu } from '@/components/navigation-menu';
import { UserDropdown } from '@/components/user-dropdown';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useWebhooks, useCreateWebhook, useUpdateWebhook, useDeleteWebhook, useTestWebhook, useWebhookDeliveries } from '@/lib/webhook-hooks';
import { WebhookData, WebhookDelivery } from '@/lib/webhook-client';
import { 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  TestTube, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  Activity,
  ArrowLeft,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';



// Static data for demonstration
const mockWebhooks: WebhookData[] = [
  {
    id: 'webhook-001',
    name: 'Production Cancellation Notifications',
    url: 'https://api.example.com/webhooks/cancellations',
    events: ['cancellation.started', 'cancellation.completed', 'cancellation.failed'],
    headers: {
      'Authorization': 'Bearer prod-token-123',
      'Content-Type': 'application/json'
    },
    isActive: true,
    secret: 'prod-secret-key-123456789',
    retryConfig: {
      maxRetries: 3,
      retryDelay: 5000,
      backoffMultiplier: 2
    },
    createdBy: 'admin@arcube.com',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z'
  },
  {
    id: 'webhook-002',
    name: 'Staging Test Webhook',
    url: 'https://staging.example.com/webhooks/test',
    events: ['cancellation.started', 'refund.processed'],
    headers: {
      'X-API-Key': 'staging-key-456'
    },
    isActive: false,
    retryConfig: {
      maxRetries: 2,
      retryDelay: 3000,
      backoffMultiplier: 1.5
    },
    createdBy: 'admin@arcube.com',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-12T16:45:00Z'
  }
];

const mockDeliveries: WebhookDelivery[] = [
  {
    id: 'delivery-001',
    webhookId: 'webhook-001',
    eventType: 'cancellation.completed',
    status: 'delivered',
    attempts: 1,
    deliveredAt: '2024-03-15T10:30:00Z',
    correlationId: 'corr-123',
    createdAt: '2024-03-15T10:29:55Z'
  },
  {
    id: 'delivery-002',
    webhookId: 'webhook-001',
    eventType: 'cancellation.failed',
    status: 'failed',
    attempts: 3,
    lastAttemptAt: '2024-03-15T09:15:00Z',
    errorMessage: 'Connection timeout',
    correlationId: 'corr-124',
    createdAt: '2024-03-15T09:10:00Z'
  },
  {
    id: 'delivery-003',
    webhookId: 'webhook-002',
    eventType: 'refund.processed',
    status: 'retrying',
    attempts: 2,
    lastAttemptAt: '2024-03-15T08:45:00Z',
    correlationId: 'corr-125',
    createdAt: '2024-03-15T08:40:00Z'
  }
];

const eventTypes = [
  'cancellation.started',
  'cancellation.completed',
  'cancellation.failed',
  'cancellation.partial',
  'refund.processed',
  'audit.updated'
];

export default function WebhooksPage() {
  const { user, isLoading } = useAuth();
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeliveries, setShowDeliveries] = useState(false);
  
  // React Query hooks
  const { data: webhooksData, isLoading: webhooksLoading, error: webhooksError } = useWebhooks();
  const webhooks = Array.isArray(webhooksData) ? webhooksData : [];
  const createWebhookMutation = useCreateWebhook();
  const updateWebhookMutation = useUpdateWebhook();
  const deleteWebhookMutation = useDeleteWebhook();
  const testWebhookMutation = useTestWebhook();
  const { data: deliveriesData, isLoading: deliveriesLoading } = useWebhookDeliveries(selectedWebhook?.id || '');
  const deliveries = Array.isArray(deliveriesData) ? deliveriesData : [];
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    headers: {} as Record<string, string>,
    secret: '',
    isActive: true,
    retryConfig: {
      maxRetries: 3,
      retryDelay: 5000,
      backoffMultiplier: 2
    }
  });

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect to login)
  if (!user) {
    return null;
  }

  // Only allow admin access
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only administrators can access webhook settings.</p>
          <Button asChild>
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleCreateWebhook = () => {
    createWebhookMutation.mutate({
      name: formData.name,
      url: formData.url,
      events: formData.events,
      headers: formData.headers,
      secret: formData.secret || undefined,
      retryConfig: formData.retryConfig
    }, {
      onSuccess: () => {
        setShowCreateForm(false);
        setFormData({
          name: '',
          url: '',
          events: [],
          headers: {},
          secret: '',
          isActive: true,
          retryConfig: {
            maxRetries: 3,
            retryDelay: 5000,
            backoffMultiplier: 2
          }
        });
      }
    });
  };

  const handleEditWebhook = () => {
    if (!selectedWebhook) return;
    updateWebhookMutation.mutate({
      id: selectedWebhook.id,
      webhook: {
        name: formData.name,
        url: formData.url,
        events: formData.events,
        headers: formData.headers,
        secret: formData.secret || undefined,
        isActive: formData.isActive,
        retryConfig: formData.retryConfig
      }
    }, {
      onSuccess: () => {
        setShowEditForm(false);
        setSelectedWebhook(null);
      }
    });
  };

  const handleDeleteWebhook = (webhookId: string) => {
    deleteWebhookMutation.mutate(webhookId);
  };

  const handleTestWebhook = (webhookId: string) => {
    testWebhookMutation.mutate(webhookId, {
      onSuccess: (result) => {
        if (result.success) {
          alert(`✅ Webhook test successful!\nStatus: ${result.statusCode}\nResponse Time: ${result.responseTime}ms`);
        } else {
          alert(`❌ Webhook test failed!\nError: ${result.errorMessage}`);
        }
      },
      onError: (error) => {
        alert(`❌ Webhook test failed!\nError: ${error.message}`);
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'retrying':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'retrying':
        return <RefreshCw className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Webhook className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Webhooks</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <NavigationMenu />
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Webhook Management</h2>
                <p className="text-gray-600">Configure webhooks for real-time cancellation notifications</p>
              </div>
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </div>
          </div>

          {/* Webhooks List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Registered Webhooks</h3>
            </div>
            <div className="p-6">
              {webhooksLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading webhooks...</p>
                </div>
              ) : webhooksError ? (
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading webhooks</h3>
                  <p className="text-gray-500 mb-4">Failed to load webhooks. Please try again.</p>
                  <Button onClick={() => window.location.reload()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : webhooks.length === 0 ? (
                <div className="text-center py-8">
                  <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first webhook to receive real-time notifications.</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Webhook
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-medium text-gray-900">{webhook.name}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {webhook.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{webhook.url}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">
                              Events: {webhook.events.length}
                            </span>
                            <span className="text-xs text-gray-500">
                              Created: {new Date(webhook.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedWebhook(webhook);
                              setShowDeliveries(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Deliveries
                          </Button>
                                                     <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleTestWebhook(webhook.id)}
                             disabled={testWebhookMutation.isPending}
                           >
                             {testWebhookMutation.isPending ? (
                               <>
                                 <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                                 Testing...
                               </>
                             ) : (
                               <>
                                 <TestTube className="h-4 w-4 mr-1" />
                                 Test
                               </>
                             )}
                           </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedWebhook(webhook);
                              setFormData({
                                name: webhook.name,
                                url: webhook.url,
                                events: webhook.events,
                                headers: webhook.headers || {},
                                secret: webhook.secret || '',
                                isActive: webhook.isActive,
                                retryConfig: webhook.retryConfig
                              });
                              setShowEditForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{webhook.name}"? This action cannot be undone and will stop all notifications to this webhook.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteWebhook(webhook.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Webhook Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateForm(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Webhook</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Webhook Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter webhook name"
                />
              </div>
              
              <div>
                <Label htmlFor="url">Webhook URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
              
              <div>
                <Label>Events</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {eventTypes.map((event) => (
                    <label key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, events: [...formData.events, event] });
                          } else {
                            setFormData({ ...formData, events: formData.events.filter(e => e !== event) });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="secret">Secret Key (Optional)</Label>
                <Input
                  id="secret"
                  type="password"
                  value={formData.secret}
                  onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                  placeholder="Enter secret key for HMAC signature"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                disabled={createWebhookMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateWebhook}
                disabled={createWebhookMutation.isPending}
              >
                {createWebhookMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Webhook'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Webhook Modal */}
      {showEditForm && selectedWebhook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowEditForm(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Webhook</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Webhook Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter webhook name"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-url">Webhook URL</Label>
                <Input
                  id="edit-url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
              
              <div>
                <Label>Events</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {eventTypes.map((event) => (
                    <label key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, events: [...formData.events, event] });
                          } else {
                            setFormData({ ...formData, events: formData.events.filter(e => e !== event) });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-secret">Secret Key (Optional)</Label>
                <Input
                  id="edit-secret"
                  type="password"
                  value={formData.secret}
                  onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                  placeholder="Enter secret key for HMAC signature"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowEditForm(false)}
                disabled={updateWebhookMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditWebhook}
                disabled={updateWebhookMutation.isPending}
              >
                {updateWebhookMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Webhook'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deliveries Modal */}
      {showDeliveries && selectedWebhook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeliveries(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Delivery History - {selectedWebhook.name}
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowDeliveries(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
            
                         <div className="space-y-4">
               {deliveriesLoading ? (
                 <div className="text-center py-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                   <p className="text-sm text-gray-500">Loading deliveries...</p>
                 </div>
               ) : deliveries.length === 0 ? (
                 <div className="text-center py-8">
                   <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                   <p className="text-sm text-gray-500">No deliveries found for this webhook.</p>
                 </div>
               ) : (
                 deliveries.map((delivery) => (
                <div key={delivery.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {getStatusIcon(delivery.status)}
                          <span className="ml-1 capitalize">{delivery.status}</span>
                        </span>
                        <span className="text-sm font-medium text-gray-900">{delivery.eventType}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Correlation ID: {delivery.correlationId}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(delivery.createdAt).toLocaleString()}
                      </p>
                      {delivery.errorMessage && (
                        <p className="text-xs text-red-600 mt-1">
                          Error: {delivery.errorMessage}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Attempts: {delivery.attempts}</p>
                      {delivery.deliveredAt && (
                        <p className="text-xs text-gray-500">
                          Delivered: {new Date(delivery.deliveredAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
               ))
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 