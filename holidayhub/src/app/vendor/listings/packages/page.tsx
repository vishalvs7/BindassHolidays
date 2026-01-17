'use client';

import { useState } from 'react';
import { Package, Edit, Trash2, Eye, TrendingUp, Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

export default function VendorPackagesPage() {
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Goa Beach Package',
      status: 'active',
      price: '₹24,999',
      bookings: 12,
      rating: 4.8,
      duration: '3D/2N',
      location: 'Goa, India',
      category: 'Beach',
      lastUpdated: '2024-05-15'
    },
    {
      id: 2,
      name: 'Kerala Backwaters',
      status: 'draft',
      price: '₹18,500',
      bookings: 8,
      rating: 4.7,
      duration: '2D/1N',
      location: 'Alleppey, Kerala',
      category: 'Houseboat',
      lastUpdated: '2024-05-10'
    },
    {
      id: 3,
      name: 'Himalayan Trek',
      status: 'active',
      price: '₹32,000',
      bookings: 5,
      rating: 4.9,
      duration: '5D/4N',
      location: 'Manali, Himachal',
      category: 'Adventure',
      lastUpdated: '2024-05-20'
    },
  ]);

  const deletePackage = (id: number) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
            <p className="text-gray-600 mt-2">Manage your travel packages</p>
          </div>
          <Link
            href="/vendor/listings/packages/new"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center space-x-2"
          >
            <Package size={20} />
            <span>Add New Package</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{packages.length}</div>
              <div className="text-sm text-gray-600">Total Packages</div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{packages.filter(p => p.status === 'active').length}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">25</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">₹75,499</div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold">₹</span>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
              All ({packages.length})
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              Active ({packages.filter(p => p.status === 'active').length})
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              Draft ({packages.filter(p => p.status === 'draft').length})
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search packages..."
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{pkg.name}</div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin size={14} className="mr-2" />
                        {pkg.location}
                        <span className="mx-2">•</span>
                        <Calendar size={14} className="mr-2" />
                        {pkg.duration}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                      {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-lg font-semibold text-gray-900">{pkg.price}</div>
                    <div className="text-sm text-gray-500">per person</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Users size={16} className="mr-2 text-gray-400" />
                      <span className="font-medium">{pkg.bookings}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(pkg.rating))}
                        {'☆'.repeat(5 - Math.floor(pkg.rating))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{pkg.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/vendor/listings/packages/edit/${pkg.id}`}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {packages.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-8 bg-purple-50 rounded-full mb-6">
              <Package size={64} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No packages yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Create your first travel package to start accepting bookings from travelers.
            </p>
            <Link
              href="/vendor/listings/packages/new"
              className="inline-flex items-center px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-lg"
            >
              <Package size={20} className="mr-2" />
              Create Your First Package
            </Link>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{packages.length}</span> of{' '}
              <span className="font-medium">{packages.length}</span> packages
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">💡 Package Listing Tips</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-purple-600 mt-0.5">•</div>
            <span className="ml-3 text-gray-700">Add high-quality photos to increase bookings by 40%</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-purple-600 mt-0.5">•</div>
            <span className="ml-3 text-gray-700">Include detailed itineraries and clear pricing</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-purple-600 mt-0.5">•</div>
            <span className="ml-3 text-gray-700">Respond to customer inquiries within 24 hours</span>
          </li>
        </ul>
      </div>
    </div>
  );
}