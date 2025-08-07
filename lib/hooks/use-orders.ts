import { useState, useEffect, useCallback } from 'react';
import { ordersApi, Order, OrderWithProducts, GetOrdersParams, OrdersResponse } from '../api/orders';

interface UseOrdersReturn {
  orders: Order[];
  ordersWithProducts: OrderWithProducts[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchOrders: (params?: GetOrdersParams) => Promise<void>;
  fetchOrdersWithProducts: (params?: GetOrdersParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersWithProducts, setOrdersWithProducts] = useState<OrderWithProducts[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchOrders = useCallback(async (params: GetOrdersParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: OrdersResponse = await ordersApi.getOrders(params);
      
      if (response.success) {
        setOrders(response.data.orders as Order[]);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrdersWithProducts = useCallback(async (params: GetOrdersParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: OrdersResponse = await ordersApi.getOrdersWithProducts(params);
      
      if (response.success) {
        setOrdersWithProducts(response.data.orders as OrderWithProducts[]);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch orders with products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching orders with products');
      console.error('Error fetching orders with products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  // Initial fetch on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    ordersWithProducts,
    loading,
    error,
    pagination,
    fetchOrders,
    fetchOrdersWithProducts,
    refetch,
  };
} 