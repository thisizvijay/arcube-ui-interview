'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Eye, XCircle, RefreshCw, AlertCircle, CheckCircle2, Clock, Wifi, Car, Building2, DollarSign, User, Phone, Mail, Plane, MapPin } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';

interface Product {
  id: string;
  title: string;
  provider: string;
  type: string;
  price: {
    amount: number;
    currency: string;
  };
  status: string;
  cancellationPolicy: {
    windows: Array<{
      hoursBeforeService: number;
      refundPercentage: number;
      description: string;
    }>;
    canCancel: boolean;
  };
  serviceDateTime: string;
  metadata: Record<string, unknown>;
}

interface OrderWithProducts {
  order: {
    id: string;
    pnr: string;
    status: string;
    totalAmount?: number;
    totalCurrency?: string;
    customer: {
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
    };
    segments: Array<{
      segmentId: string;
      flightNumber: string;
      departure: string;
      arrival: string;
      departureTime: string;
      arrivalTime: string;
      operatingCarrier: string;
      passengerIds: string[];
    }>;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  };
  products: Product[];
}

interface EnhancedProductDialogProps {
  orderId: string;
  pnr: string;
  onProductCancelled: () => void;
  children: React.ReactNode;
}

const getProductTypeIcon = (type: string) => {
  switch (type) {
    case 'esim':
      return <Wifi className="h-4 w-4" />;
    case 'airport_transfer':
      return <Car className="h-4 w-4" />;
    case 'lounge_access':
      return <Building2 className="h-4 w-4" />;
    default:
      return <Eye className="h-4 w-4" />;
  }
};

const getProductStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'expired':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getProductStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    case 'expired':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export function EnhancedProductDialog({ orderId, pnr, onProductCancelled, children }: EnhancedProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [orderWithProducts, setOrderWithProducts] = useState<OrderWithProducts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancellingProductId, setCancellingProductId] = useState<string | null>(null);

  const fetchOrderWithProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ordersApi.getOrderWithProducts(orderId);
      
      if (response.success) {
        setOrderWithProducts(response.data);
      } else {
        setError('Failed to fetch order details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching order details');
      console.error('Error fetching order with products:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const handleCancelProduct = async (productId: string) => {
    if (!orderWithProducts) return;
    
    try {
      setCancellingProductId(productId);
      setError(null);

      await ordersApi.cancelOrder(orderWithProducts.order.id, [productId]);
      
      // Refresh the order data
      await fetchOrderWithProducts();
      onProductCancelled();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel product');
    } finally {
      setCancellingProductId(null);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString();
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  // Fetch data when sheet opens
  useEffect(() => {
    if (isOpen && !orderWithProducts) {
      fetchOrderWithProducts();
    }
  }, [isOpen, orderWithProducts, fetchOrderWithProducts]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[1000px] sm:w-[1000px] overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Plane className="h-6 w-6" />
            Order Products - {pnr}
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">Loading order details...</span>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error loading order</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto"
                  onClick={fetchOrderWithProducts}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Order Details */}
          {orderWithProducts && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Plane className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-lg">Order {orderWithProducts.order.pnr}</span>
                  </div>
                  <Badge className={getProductStatusColor(orderWithProducts.order.status)}>
                    {getProductStatusIcon(orderWithProducts.order.status)}
                    <span className="ml-1 capitalize">{orderWithProducts.order.status}</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Created on {formatDate(orderWithProducts.order.createdAt)} at {formatTime(orderWithProducts.order.createdAt)}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {/* Customer Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      Customer
                    </h4>
                    <div className="space-y-1">
                      <div>{orderWithProducts.order.customer.firstName} {orderWithProducts.order.customer.lastName}</div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="h-3 w-3" />
                        {orderWithProducts.order.customer.email}
                      </div>
                      {orderWithProducts.order.customer.phone && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Phone className="h-3 w-3" />
                          {orderWithProducts.order.customer.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flight Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                      <Plane className="h-4 w-4" />
                      Flights
                    </h4>
                    <div className="space-y-1">
                      {orderWithProducts.order.segments.map((segment) => (
                        <div key={segment.segmentId} className="text-xs">
                          <div className="font-medium">{segment.flightNumber}</div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {segment.departure} → {segment.arrival}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4" />
                      Summary
                    </h4>
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-green-600">
                        {formatPrice(orderWithProducts.order.totalAmount || 0, orderWithProducts.order.totalCurrency || 'USD')}
                      </div>
                      <div>{orderWithProducts.products.length} products</div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {orderWithProducts.order.notes && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                    <p className="text-sm text-gray-600">{orderWithProducts.order.notes}</p>
                  </div>
                )}
              </div>

              {/* Products List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Products ({orderWithProducts.products.length})</h2>
                  <Badge variant="outline">
                    {orderWithProducts.products.filter(p => p.cancellationPolicy.canCancel && p.status !== 'cancelled').length} Cancellable
                  </Badge>
                </div>

                {orderWithProducts.products.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This order doesn&apos;t have any products associated with it.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderWithProducts.products.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {getProductTypeIcon(product.type)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{product.title}</h3>
                              <p className="text-sm text-gray-600">
                                {product.provider} • {product.type.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getProductStatusColor(product.status)}>
                              {getProductStatusIcon(product.status)}
                              <span className="ml-1 capitalize">{product.status}</span>
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Price:</span>
                              <span className="font-semibold text-green-600">
                                {formatPrice(product.price.amount, product.price.currency)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Service Date:</span>
                              <span className="text-sm">{formatDateTime(product.serviceDateTime)}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Cancellable:</span>
                              <Badge variant={product.cancellationPolicy.canCancel ? "default" : "secondary"}>
                                {product.cancellationPolicy.canCancel ? "Yes" : "No"}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.cancellationPolicy.windows.length} cancellation windows
                            </div>
                          </div>
                        </div>

                        {/* Cancellation Policy Details */}
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Cancellation Policy:</h4>
                          <div className="space-y-1">
                            {product.cancellationPolicy.windows.map((window, idx) => (
                              <div key={idx} className="text-xs text-gray-600">
                                • {window.description} - {window.refundPercentage}% refund
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end pt-3 border-t border-gray-100">
                          {product.cancellationPolicy.canCancel && product.status !== 'cancelled' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  disabled={cancellingProductId === product.id}
                                >
                                  {cancellingProductId === product.id ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      Cancelling...
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Product
                                    </>
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Product</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel &quot;{product.title}&quot;? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancelProduct(product.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Yes, Cancel Product
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 