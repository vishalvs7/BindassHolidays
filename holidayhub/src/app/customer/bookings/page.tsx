'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { Calendar, MapPin, Users, Clock, Package, User, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function CustomerBookingsPage() {
  const { userData } = useAuth();
  
  // Placeholder booking data
  const bookings = [
    { 
      id: 1, 
      title: 'Goa Beach Package', 
      type: 'package',
      status: 'upcoming',
      date: '2024-06-15',
      guests: 2,
      price: '₹24,999',
      location: 'Goa, India'
    },
    { 
      id: 2, 
      title: 'Trekking in Himalayas', 
      type: 'activity',
      status: 'completed',
      date: '2024-05-20',
      guests: 4,
      price: '₹8,499',
      location: 'Manali, Himachal'
    },
    { 
      id: 3, 
      title: 'Kerala Backwaters', 
      type: 'package',
      status: 'cancelled',
      date: '2024-07-10',
      guests: 3,
      price: '₹18,500',
      location: 'Alleppey, Kerala'
    },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Overview Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
              <User className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{userData?.name || 'Traveler'}</h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{userData?.email || 'No email'}</span>
                </div>
                {userData?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{userData.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Member since {userData?.createdAt 
                      ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      : 'Recently'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <Link 
              href="/customer/settings" 
              className="inline-flex items-center px-6 py-3 bg-white text-primary-700 rounded-lg hover:bg-gray-100 font-medium transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">1</div>
              <div className="text-sm text-gray-600">Upcoming Trips</div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">Next trip: June 15</div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">1</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">Last: May 20</div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">₹33,498</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">₹</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">Avg: ₹16,749/trip</div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-600">Travel Buddies</div>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">Max in a trip: 4</div>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
              <p className="text-gray-600 text-sm mt-1">Manage and track all your travel bookings</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/packages" 
                className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm"
              >
                Book New Trip
              </Link>
              <Link 
                href="/customer/custom-package" 
                className="px-5 py-2.5 bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium text-sm"
              >
                Custom Trip
              </Link>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="min-w-[250px]">
                      <div className="font-semibold text-gray-900 text-base">{booking.title}</div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate">{booking.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      booking.type === 'package' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.type === 'package' ? '📦 Package' : '⚡ Activity'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar size={14} className="mr-2 flex-shrink-0" />
                      <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users size={14} className="mr-2 flex-shrink-0" />
                      <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{booking.price}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status === 'upcoming' && '⏳ '}
                      {booking.status === 'completed' && '✅ '}
                      {booking.status === 'cancelled' && '❌ '}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                        View Details
                      </button>
                      {booking.status === 'upcoming' && (
                        <button className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium">
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="text-center py-16 px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your adventure by exploring our handpicked travel packages and exciting activities
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/packages"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                Browse All Packages
              </Link>
              <Link
                href="/activities"
                className="px-8 py-3 bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium"
              >
                Explore Activities
              </Link>
            </div>
          </div>
        )}
        
        {/* Footer */}
        {bookings.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>Showing {bookings.length} bookings</div>
              <div className="flex space-x-4">
                <button className="hover:text-gray-900">Previous</button>
                <span className="font-medium">1</span>
                <button className="hover:text-gray-900">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/customer/wishlist" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-200 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 font-bold">❤️</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Wishlist</div>
                <div className="text-sm text-gray-600">Saved items</div>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/customer/custom-package" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-200 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Custom Trip</div>
                <div className="text-sm text-gray-600">Design your own</div>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/customer/settings" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-200 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">⚙️</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Settings</div>
                <div className="text-sm text-gray-600">Profile & preferences</div>
              </div>
            </div>
          </Link>
          
          <a 
            href="/help" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-200 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">❓</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Help Center</div>
                <div className="text-sm text-gray-600">Need help?</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}