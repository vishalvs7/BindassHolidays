'use client';

import { 
  Calendar, 
  User, 
  Package, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Activity,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Users
} from 'lucide-react';
import { useState } from 'react';

export default function VendorBookingsPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const bookings = [
    { 
      id: 1, 
      customer: 'John Doe', 
      type: 'package', 
      item: 'Goa Beach Package - 4D/3N', 
      date: '2024-06-15', 
      guests: 2, 
      amount: '₹24,999', 
      status: 'confirmed',
      payment: 'paid',
      bookingDate: '2024-05-20'
    },
    { 
      id: 2, 
      customer: 'Jane Smith', 
      type: 'activity', 
      item: 'Paragliding Adventure', 
      date: '2024-06-18', 
      guests: 1, 
      amount: '₹3,499', 
      status: 'pending',
      payment: 'pending',
      bookingDate: '2024-05-25'
    },
    { 
      id: 3, 
      customer: 'Bob Wilson', 
      type: 'package', 
      item: 'Kerala Backwaters Luxury', 
      date: '2024-06-20', 
      guests: 4, 
      amount: '₹18,500', 
      status: 'confirmed',
      payment: 'paid',
      bookingDate: '2024-05-18'
    },
    { 
      id: 4, 
      customer: 'Alice Johnson', 
      type: 'activity', 
      item: 'White Water Rafting', 
      date: '2024-06-22', 
      guests: 3, 
      amount: '₹6,750', 
      status: 'confirmed',
      payment: 'paid',
      bookingDate: '2024-05-22'
    },
    { 
      id: 5, 
      customer: 'Mike Brown', 
      type: 'package', 
      item: 'Himalayan Trek', 
      date: '2024-07-05', 
      guests: 6, 
      amount: '₹45,000', 
      status: 'pending',
      payment: 'partial',
      bookingDate: '2024-05-28'
    },
    { 
      id: 6, 
      customer: 'Sarah Williams', 
      type: 'package', 
      item: 'Beach Resort Stay', 
      date: '2024-06-28', 
      guests: 2, 
      amount: '₹15,999', 
      status: 'cancelled',
      payment: 'refunded',
      bookingDate: '2024-05-15'
    },
  ];

  const stats = [
    { 
      title: 'Total Bookings', 
      value: '43', 
      change: '+12%', 
      trend: 'up',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: 'Confirmed', 
      value: '38', 
      change: '+8%', 
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: 'Pending', 
      value: '3', 
      change: '-2%', 
      trend: 'down',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600'
    },
    { 
      title: 'Revenue', 
      value: '₹2,48,456', 
      change: '+15%', 
      trend: 'up',
      icon: CreditCard,
      color: 'bg-purple-100 text-purple-600'
    },
  ];

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return booking.status === 'confirmed' || booking.status === 'pending';
    if (filter === 'past') return booking.status === 'cancelled';
    if (filter === 'confirmed') return booking.status === 'confirmed';
    if (filter === 'pending') return booking.status === 'pending';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  }).filter(booking => 
    booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return <CheckCircle size={14} className="mr-1.5" />;
      case 'pending': return <Clock size={14} className="mr-1.5" />;
      case 'cancelled': return <XCircle size={14} className="mr-1.5" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getPaymentStatus = (payment: string) => {
    switch(payment) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer bookings</p>
        </div>
        <button className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
          <Download size={18} className="mr-2" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-3">
                    {stat.trend === 'up' ? (
                      <TrendingUp size={16} className="text-green-500 mr-1.5" />
                    ) : (
                      <TrendingDown size={16} className="text-red-500 mr-1.5" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Bookings
            </button>
            <button 
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'upcoming' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'confirmed' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Confirmed
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'cancelled' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Cancelled
            </button>
          </div>
          
          <div className="flex gap-3">
            <div className="relative flex-1 lg:flex-none lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option>Sort by: Date</option>
              <option>Sort by: Amount</option>
              <option>Sort by: Customer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {filter === 'all' ? 'All Bookings' : 
                 filter === 'upcoming' ? 'Upcoming Bookings' :
                 filter === 'confirmed' ? 'Confirmed Bookings' :
                 filter === 'pending' ? 'Pending Bookings' : 'Cancelled Bookings'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold text-gray-900">₹{filteredBookings.reduce((sum, b) => sum + parseInt(b.amount.replace(/[^0-9]/g, '')), 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="min-w-[200px]">
                      <div className="flex items-start">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-3 mt-1 ${
                          booking.type === 'package' ? 'bg-purple-100' : 'bg-blue-100'
                        }`}>
                          {booking.type === 'package' ? (
                            <Package size={18} className="text-purple-600" />
                          ) : (
                            <Activity size={18} className="text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{booking.item}</div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar size={12} className="mr-1" />
                            Booked: {new Date(booking.bookingDate).toLocaleDateString('en-IN')}
                          </div>
                          <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${getPaymentStatus(booking.payment)}`}>
                            {booking.payment}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <User size={14} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{booking.customer}</div>
                        <div className="text-xs text-gray-500">ID: #BH{booking.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Users size={14} className="text-gray-400 mr-2" />
                      <span className="font-medium">{booking.guests}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        {booking.guests === 1 ? 'guest' : 'guests'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{booking.amount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <MessageSquare size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery ? 'No bookings match your search. Try different keywords.' : 'No bookings available for the selected filter.'}
              </p>
              {(searchQuery || filter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table Footer */}
        {filteredBookings.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing 1 to {filteredBookings.length} of {bookings.length} bookings
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <div className="flex space-x-1">
                  <button className="h-8 w-8 flex items-center justify-center bg-primary-600 text-white rounded text-sm font-medium">1</button>
                  <button className="h-8 w-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded text-sm">2</button>
                  <button className="h-8 w-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded text-sm">3</button>
                </div>
                <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Confirmed Rate</span>
              <span className="font-semibold text-gray-900">88%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Booking Value</span>
              <span className="font-semibold text-gray-900">₹5,777</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Repeat Customers</span>
              <span className="font-semibold text-gray-900">12</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Insights</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold text-gray-900">₹45,250</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Month</span>
              <span className="font-semibold text-gray-900">₹38,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Growth</span>
              <span className="font-semibold text-green-600">+17.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2.5 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 text-sm font-medium">
              Send Booking Reminders
            </button>
            <button className="w-full text-left px-4 py-2.5 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 text-sm font-medium">
              Update Availability
            </button>
            <button className="w-full text-left px-4 py-2.5 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 text-sm font-medium">
              Generate Invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}