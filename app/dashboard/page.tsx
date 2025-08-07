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
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  XCircle,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  Bell,
  Eye
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  // Static data for dashboard
  const dashboardData = {
    cancellationStats: {
      total: 156,
      successful: 142,
      failed: 14,
      pending: 8,
      successRate: 91.0
    },
    refundStats: {
      totalAmount: 45680.50,
      currency: 'USD',
      averageRefund: 321.69,
      totalRefunds: 142
    },
    recentCancellations: [
      {
        id: 'CAN-001',
        orderId: 'ORD-123',
        customer: 'John Doe',
        amount: 1250.00,
        status: 'successful',
        timestamp: '2024-03-15T10:30:00Z',
        reason: 'Customer request'
      },
      {
        id: 'CAN-002',
        orderId: 'ORD-124',
        customer: 'Jane Smith',
        amount: 890.00,
        status: 'failed',
        timestamp: '2024-03-15T09:15:00Z',
        reason: 'System error'
      },
      {
        id: 'CAN-003',
        orderId: 'ORD-125',
        customer: 'Mike Wilson',
        amount: 2100.00,
        status: 'pending',
        timestamp: '2024-03-15T08:45:00Z',
        reason: 'Processing'
      },
      {
        id: 'CAN-004',
        orderId: 'ORD-126',
        customer: 'Sarah Johnson',
        amount: 750.00,
        status: 'successful',
        timestamp: '2024-03-15T08:20:00Z',
        reason: 'Customer request'
      }
    ],
    alerts: [
      {
        id: 1,
        type: 'error',
        message: 'Cancellation failed for Order ORD-124',
        timestamp: '2024-03-15T09:15:00Z',
        severity: 'high'
      },
      {
        id: 2,
        type: 'warning',
        message: 'High cancellation rate detected',
        timestamp: '2024-03-15T08:30:00Z',
        severity: 'medium'
      },
      {
        id: 3,
        type: 'info',
        message: 'System maintenance scheduled',
        timestamp: '2024-03-15T07:45:00Z',
        severity: 'low'
      }
    ],
    trends: {
      daily: [
        { day: 'Mon', cancellations: 45, refunds: 12500 },
        { day: 'Tue', cancellations: 52, refunds: 15800 },
        { day: 'Wed', cancellations: 38, refunds: 11200 },
        { day: 'Thu', cancellations: 61, refunds: 18900 },
        { day: 'Fri', cancellations: 55, refunds: 16500 },
        { day: 'Sat', cancellations: 48, refunds: 14200 },
        { day: 'Sun', cancellations: 42, refunds: 12800 }
      ],
      weekly: [
        { week: 'Week 1', cancellations: 320, refunds: 95000 },
        { week: 'Week 2', cancellations: 285, refunds: 82000 },
        { week: 'Week 3', cancellations: 310, refunds: 92000 },
        { week: 'Week 4', cancellations: 295, refunds: 88000 },
        { week: 'Week 5', cancellations: 340, refunds: 102000 },
        { week: 'Week 6', cancellations: 315, refunds: 94000 },
        { week: 'Week 7', cancellations: 330, refunds: 98000 }
      ],
      monthly: [
        { month: 'Jan', cancellations: 1250, refunds: 380000 },
        { month: 'Feb', cancellations: 1180, refunds: 350000 },
        { month: 'Mar', cancellations: 1320, refunds: 400000 },
        { month: 'Apr', cancellations: 1280, refunds: 390000 },
        { month: 'May', cancellations: 1400, refunds: 420000 },
        { month: 'Jun', cancellations: 1350, refunds: 410000 },
        { month: 'Jul', cancellations: 1420, refunds: 430000 }
      ]
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
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
          {/* Dashboard Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">Real-Time Dashboard</h2>
                  <p className="text-gray-600">Live cancellation status updates and analytics</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Cancellations */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cancellations</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.cancellationStats.total}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% from last week</span>
                </div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.cancellationStats.successRate}%</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+2.5% from last week</span>
                </div>
              </div>
            </div>

            {/* Total Refunds */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Refunds</p>
                  <p className="text-2xl font-bold text-gray-900">${dashboardData.refundStats.totalAmount.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8.3% from last week</span>
                </div>
              </div>
            </div>

            {/* Failed Cancellations */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Cancellations</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.cancellationStats.failed}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">-5.2% from last week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Updates and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Cancellations */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Cancellations</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentCancellations.map((cancellation) => (
                    <div key={cancellation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-3 ${
                          cancellation.status === 'successful' ? 'bg-green-500' :
                          cancellation.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{cancellation.orderId}</p>
                          <p className="text-xs text-gray-500">{cancellation.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${cancellation.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 capitalize">{cancellation.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alert Notifications */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Alert Notifications</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                      alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-start">
                        <AlertTriangle className={`h-5 w-5 mr-3 mt-0.5 ${
                          alert.severity === 'high' ? 'text-red-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Analytics & Reporting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Cancellation Trends */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Cancellation Trends</h3>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={dashboardData.trends.daily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        labelStyle={{ color: '#374151', fontWeight: '600' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cancellations" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Today</p>
                    <p className="text-lg font-bold text-blue-600">42</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">This Week</p>
                    <p className="text-lg font-bold text-blue-600">315</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">This Month</p>
                    <p className="text-lg font-bold text-blue-600">1,420</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Tracking */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Refund Amount Tracking</h3>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={dashboardData.trends.daily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        labelStyle={{ color: '#374151', fontWeight: '600' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Refunds']}
                      />
                      <Bar 
                        dataKey="refunds" 
                        fill="#10b981" 
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Refund</span>
                    <span className="text-sm font-medium text-gray-900">${dashboardData.refundStats.averageRefund}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Refunds Processed</span>
                    <span className="text-sm font-medium text-gray-900">{dashboardData.refundStats.totalRefunds}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="text-sm font-medium text-green-600">{dashboardData.cancellationStats.successRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Functionality */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Reports</h3>
              <Button className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Cancellation Report
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Refund Report
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Analytics Report
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
