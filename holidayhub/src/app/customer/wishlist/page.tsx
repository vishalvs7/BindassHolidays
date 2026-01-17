'use client';

import { Heart, MapPin, Star, Users, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CustomerWishlistPage() {
  // Placeholder wishlist items
  const wishlistItems = [
    {
      id: 1,
      title: 'Luxury Houseboat Stay',
      type: 'package',
      location: 'Kerala',
      rating: 4.8,
      reviews: 124,
      duration: '3D/2N',
      price: '₹18,999',
      image: '🏠',
      category: 'Luxury'
    },
    {
      id: 2,
      title: 'Paragliding Adventure',
      type: 'activity',
      location: 'Bir Billing',
      rating: 4.9,
      reviews: 89,
      duration: '1 Day',
      price: '₹3,499',
      image: '🪂',
      category: 'Adventure'
    },
    {
      id: 3,
      title: 'Desert Safari & Camping',
      type: 'package',
      location: 'Rajasthan',
      rating: 4.7,
      reviews: 256,
      duration: '2D/1N',
      price: '₹12,500',
      image: '🏜️',
      category: 'Camping'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">Save packages and activities you love</p>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="text-red-500" size={24} />
            <span className="text-2xl font-bold text-gray-900">{wishlistItems.length}</span>
          </div>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Item Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    item.type === 'package' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.type === 'package' ? 'Package' : 'Activity'}
                  </span>
                  <span className="ml-2 inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                </div>
                <button className="text-red-500 hover:text-red-600">
                  <Heart size={20} fill="currentColor" />
                </button>
              </div>

              {/* Item Image/Icon */}
              <div className="text-6xl text-center mb-4">{item.image}</div>

              {/* Item Details */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  {item.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2" />
                  {item.duration}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-2" />
                  2-10 People
                </div>
              </div>

              {/* Rating and Price */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 mr-1" fill="currentColor" />
                  <span className="font-semibold">{item.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({item.reviews} reviews)</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{item.price}</div>
                  <div className="text-sm text-gray-500">per person</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                  Book Now
                </button>
                <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-block p-8 bg-red-50 rounded-full mb-6">
            <Heart size={64} className="text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Save your favorite travel packages and activities here. They'll be waiting for you when you're ready to book!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/packages"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              Explore Packages
            </Link>
            <Link
              href="/activities"
              className="px-8 py-3 bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium"
            >
              Browse Activities
            </Link>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Popular Package {i}</h3>
              <p className="text-gray-600 text-sm mb-4">Discover amazing experiences</p>
              <button className="w-full px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}