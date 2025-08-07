

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

  async cancelOrder(orderId: string, productIds: string[]): Promise<any> {
    return this.request('/orders/cancel', {
      method: 'POST',
      body: JSON.stringify({
        orderId,
        productIds,
        reason: 'Customer request'
      }),
    });
  }

  async getOrderWithProducts(orderId: string): Promise<SingleOrderResponse> {
    return this.request<SingleOrderResponse>(`/orders/${orderId}/with-products`);
  }
}

export const ordersApi = new OrdersApi(); 