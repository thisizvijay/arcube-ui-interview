

export interface Order {
  id: string;
  pnr: string;
  transactionId: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  products: string[];
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
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'expired';
  userId?: string;
  totalAmount?: number;
  totalCurrency?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderSummary?: {
    pnr: string;
    customerName: string;
    productCount: number;
    totalAmount: number;
    totalCurrency: string;
    status: string;
  };
}

export interface OrderWithProducts {
  order: Order;
  products: Array<{
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
    metadata: Record<string, any>;
  }>;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[] | OrderWithProducts[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SingleOrderResponse {
  success: boolean;
  data: OrderWithProducts;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  provider?: string;
  type?: string;
}

class OrdersApi {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getOrders(params: GetOrdersParams = {}): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.provider) searchParams.append('provider', params.provider);
    if (params.type) searchParams.append('type', params.type);

    const queryString = searchParams.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;

    return this.request<OrdersResponse>(endpoint);
  }

  async getOrdersWithProducts(params: GetOrdersParams = {}): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.provider) searchParams.append('provider', params.provider);
    if (params.type) searchParams.append('type', params.type);

    const queryString = searchParams.toString();
    const endpoint = `/orders/with-products${queryString ? `?${queryString}` : ''}`;

    return this.request<OrdersResponse>(endpoint);
  }

  async cancelOrder(orderId: string, pnr: string, productIds: string[], customerEmail?: string): Promise<any> {
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Determine request source and user role based on actual user role
    let requestSource: 'customer_app' | 'admin_panel' | 'partner_api' | 'system';
    let userRole: string;
    
    if (userInfo.role === 'admin' || userInfo.role === 'customer_service') {
      requestSource = 'admin_panel';
      userRole = userInfo.role;
    } else if (userInfo.role === 'partner') {
      requestSource = 'partner_api';
      userRole = userInfo.role;
    } else if (userInfo.role === 'system') {
      requestSource = 'system';
      userRole = userInfo.role;
    } else {
      // Default to customer_app for any other role
      requestSource = 'customer_app';
      userRole = 'customer';
    }
    
    const requestBody = {
      orderIdentifier: {
        orderId: orderId,
        pnr: pnr,
        email: customerEmail || userInfo.email
      },
      productId: productIds.length === 1 ? productIds[0] : undefined,
      requestSource: requestSource,
      reason: 'Customer request',
      requestedBy: {
        userId: userInfo.id || 'unknown',

        userRole: userRole,
        metadata: {
          email: userInfo.email,
          source: requestSource
        }
      }
    };
    
    // Debug: Log request details
    console.log('User info:', userInfo);
    console.log('User role:', userRole);
    console.log('Request source:', requestSource);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    return this.request('/orders/cancel', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  async getOrderWithProducts(orderId: string): Promise<SingleOrderResponse> {
    return this.request<SingleOrderResponse>(`/orders/${orderId}/with-products`);
  }
}

export const ordersApi = new OrdersApi(); 