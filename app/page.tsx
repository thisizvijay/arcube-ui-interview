'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { UserDropdown } from '@/components/user-dropdown';
import { NavigationMenu } from '@/components/navigation-menu';
import { 
  User, 
  Mail, 
  Shield, 
  Settings, 
  Activity,
  Calendar,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Plane,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

// Dummy order data inspired by order.model.ts
const dummyOrders = [
  {
    id: 'ord-001',
    pnr: 'ABC123',
    transactionId: 'TXN-2024-001',
    customer: {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-0123'
    },
    products: ['Flight Ticket', 'Travel Insurance'],
    segments: [
      {
        segmentId: 'seg-001',
        flightNumber: 'AA123',
        departure: 'JFK',
        arrival: 'LAX',
        departureTime: new Date('2024-03-15T10:00:00Z'),
        arrivalTime: new Date('2024-03-15T13:30:00Z'),
        operatingCarrier: 'American Airlines',
        passengerIds: ['pax-001', 'pax-002']
      }
    ],
    status: 'confirmed' as const,
    userId: 'user-001',
    totalAmount: 1250.00,
    totalCurrency: 'USD',
    notes: 'Premium seat upgrade requested',
    createdAt: new Date('2024-03-10T09:00:00Z'),
    updatedAt: new Date('2024-03-10T09:00:00Z')
  },
  {
    id: 'ord-002',
    pnr: 'DEF456',
    transactionId: 'TXN-2024-002',
    customer: {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1-555-0456'
    },
    products: ['Flight Ticket'],
    segments: [
      {
        segmentId: 'seg-002',
        flightNumber: 'DL789',
        departure: 'ATL',
        arrival: 'SFO',
        departureTime: new Date('2024-03-20T14:00:00Z'),
        arrivalTime: new Date('2024-03-20T17:45:00Z'),
        operatingCarrier: 'Delta Airlines',
        passengerIds: ['pax-003']
      }
    ],
    status: 'pending' as const,
    userId: 'user-002',
    totalAmount: 890.00,
    totalCurrency: 'USD',
    notes: '',
    createdAt: new Date('2024-03-12T11:30:00Z'),
    updatedAt: new Date('2024-03-12T11:30:00Z')
  },
  {
    id: 'ord-003',
    pnr: 'GHI789',
    transactionId: 'TXN-2024-003',
    customer: {
      email: 'mike.wilson@example.com',
      firstName: 'Mike',
      lastName: 'Wilson',
      phone: '+1-555-0789'
    },
    products: ['Flight Ticket', 'Hotel Booking', 'Car Rental'],
    segments: [
      {
        segmentId: 'seg-003',
        flightNumber: 'UA456',
        departure: 'ORD',
        arrival: 'MIA',
        departureTime: new Date('2024-03-25T08:00:00Z'),
        arrivalTime: new Date('2024-03-25T11:15:00Z'),
        operatingCarrier: 'United Airlines',
        passengerIds: ['pax-004', 'pax-005', 'pax-006']
      }
    ],
    status: 'cancelled' as const,
    userId: 'user-003',
    totalAmount: 2100.00,
    totalCurrency: 'USD',
    notes: 'Customer requested cancellation due to emergency',
    createdAt: new Date('2024-03-08T15:45:00Z'),
    updatedAt: new Date('2024-03-14T10:20:00Z')
  },
  {
    id: 'ord-004',
    pnr: 'JKL012',
    transactionId: 'TXN-2024-004',
    customer: {
      email: 'sarah.johnson@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-0321'
    },
    products: ['Flight Ticket', 'Lounge Access'],
    segments: [
      {
        segmentId: 'seg-004',
        flightNumber: 'BA789',
        departure: 'LHR',
        arrival: 'CDG',
        departureTime: new Date('2024-04-01T12:00:00Z'),
        arrivalTime: new Date('2024-04-01T15:30:00Z'),
        operatingCarrier: 'British Airways',
        passengerIds: ['pax-007']
      }
    ],
    status: 'refunded' as const,
    userId: 'user-004',
    totalAmount: 750.00,
    totalCurrency: 'EUR',
    notes: 'Refund processed due to flight cancellation',
    createdAt: new Date('2024-03-05T13:20:00Z'),
    updatedAt: new Date('2024-03-18T16:10:00Z')
  },
  {
    id: 'ord-005',
    pnr: 'MNO345',
    transactionId: 'TXN-2024-005',
    customer: {
      email: 'david.brown@example.com',
      firstName: 'David',
      lastName: 'Brown',
      phone: '+1-555-0654'
    },
    products: ['Flight Ticket', 'Baggage Insurance'],
    segments: [
      {
        segmentId: 'seg-005',
        flightNumber: 'LH234',
        departure: 'FRA',
        arrival: 'JFK',
        departureTime: new Date('2024-04-05T09:00:00Z'),
        arrivalTime: new Date('2024-04-05T12:30:00Z'),
        operatingCarrier: 'Lufthansa',
        passengerIds: ['pax-008', 'pax-009']
      }
    ],
    status: 'expired' as const,
    userId: 'user-005',
    totalAmount: 1650.00,
    totalCurrency: 'EUR',
    notes: 'Booking expired - no payment received',
    createdAt: new Date('2024-03-01T10:15:00Z'),
    updatedAt: new Date('2024-03-02T10:15:00Z')
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-blue-100 text-blue-800';
    case 'expired':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    case 'refunded':
      return <RefreshCw className="h-4 w-4" />;
    case 'expired':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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



  const filteredOrders = dummyOrders.filter(order => {
    const matchesSearch = 
      order.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Arcube</h1>
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
                <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
                <p className="text-gray-600">Manage and track all orders</p>
              </div>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by PNR, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            PNR: {order.pnr}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {order.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.products.length} product(s)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer.firstName} {order.customer.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.segments[0]?.flightNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.segments[0]?.departure} → {order.segments[0]?.arrival}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.segments[0]?.operatingCarrier}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {order.totalAmount?.toFixed(2)} {order.totalCurrency}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Plane className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plane className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-lg font-semibold text-gray-900">{dummyOrders.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Confirmed</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {dummyOrders.filter(o => o.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {dummyOrders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Cancelled</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {dummyOrders.filter(o => o.status === 'cancelled').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
