'use client';

import { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Filter, 
  Search, 
  Heart, 
  ShoppingCart,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function PackagesPage() {
  const { isAuthenticated, saveRedirectPath } = useAuth();
  const router = useRouter();
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    duration: 'all',
    location: 'all',
    sortBy: 'popular'
  });

  const packages = [
    {
      id: 1,
      title: 'Goa Beach Paradise - 4D/3N',
      description: 'Experience the sun, sand, and sea with luxury beach resorts and water sports.',
      price: '₹24,999',
      originalPrice: '₹29,999',
      duration: '4D/3N',
      location: 'Goa, India',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800',
      tags: ['Beach', 'Luxury', 'Family'],
      inclusions: ['Accommodation', 'Meals', 'Sightseeing', 'Airport Transfer'],
      isWishlisted: false
    },
    {
      id: 2,
      title: 'Kerala Backwaters Houseboat',
      description: 'Cruise through serene backwaters in traditional houseboats with local cuisine.',
      price: '₹18,500',
      originalPrice: '₹22,000',
      duration: '3D/2N',
      location: 'Alleppey, Kerala',
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800',
      tags: ['Houseboat', 'Romantic', 'Nature'],
      inclusions: ['Houseboat Stay', 'All Meals', 'Sightseeing', 'Guide'],
      isWishlisted: true
    },
    {
      id: 3,
      title: 'Himalayan Trek - Manali to Leh',
      description: 'Adventure trek through majestic Himalayas with camping and local experiences.',
      price: '₹45,000',
      originalPrice: '₹52,000',
      duration: '7D/6N',
      location: 'Himachal Pradesh',
      rating: 4.7,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800',
      tags: ['Adventure', 'Trekking', 'Camping'],
      inclusions: ['Camping Gear', 'Guide', 'Meals', 'Permits'],
      isWishlisted: false
    },
    {
      id: 4,
      title: 'Rajasthan Royal Heritage Tour',
      description: 'Explore royal palaces, forts, and desert culture of Rajasthan.',
      price: '₹32,500',
      originalPrice: '₹38,000',
      duration: '5D/4N',
      location: 'Jaipur, Rajasthan',
      rating: 4.6,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=800',
      tags: ['Heritage', 'Cultural', 'Luxury'],
      inclusions: ['Heritage Hotels', 'All Meals', 'Private Car', 'Guide'],
      isWishlisted: false
    },
    {
      id: 5,
      title: 'Andaman Island Getaway',
      description: 'Crystal clear waters, water sports, and island hopping in Andaman.',
      price: '₹38,500',
      originalPrice: '₹45,000',
      duration: '6D/5N',
      location: 'Andaman Islands',
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
      tags: ['Island', 'Beach', 'Adventure'],
      inclusions: ['Resort Stay', 'Island Hopping', 'Water Sports', 'Meals'],
      isWishlisted: true
    },
    {
      id: 6,
      title: 'North East Nature Trail',
      description: 'Explore untouched natural beauty of Meghalaya and Assam.',
      price: '₹28,999',
      originalPrice: '₹34,500',
      duration: '5D/4N',
      location: 'Meghalaya, India',
      rating: 4.8,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800',
      tags: ['Nature', 'Forest', 'Waterfalls'],
      inclusions: ['Eco Resort', 'Local Guide', 'All Meals', 'Transport'],
      isWishlisted: false
    },
  ];

  const locations = ['All Locations', 'Goa', 'Kerala', 'Himachal', 'Rajasthan', 'Andaman', 'North East'];
  const durations = ['All Durations', '2-3 Days', '4-5 Days', '6-7 Days', '7+ Days'];

  const handleAddToCart = (pkg: any) => {
    if (!isAuthenticated) {
      saveRedirectPath();
      router.push('/register/customer');
      return;
    }
    // Add to cart logic here
    alert(`Added ${pkg.title} to cart!`);
  };

  const handleWishlist = (pkg: any) => {
    if (!isAuthenticated) {
      saveRedirectPath();
      router.push('/register/customer');
      return;
    }
    // Toggle wishlist logic here
    alert(`${pkg.isWishlisted ? 'Removed from' : 'Added to'} wishlist!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Travel Packages</h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl">
            Handpicked experiences from trusted tour operators. Your perfect getaway starts here.
          </p>
          <div className="max-w-3xl">
            <div className="bg-white rounded-2xl p-2 flex items-center">
              <div className="flex-1 flex items-center px-4">
                <Search className="text-gray-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Search packages by destination, activity, or keyword..."
                  className="w-full py-3 outline-none text-gray-800"
                />
              </div>
              <button className="bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">₹{filters.priceRange[0].toLocaleString()}</span>
                    <span className="text-gray-600">₹{filters.priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Duration</h3>
                <div className="space-y-2">
                  {durations.map((duration) => (
                    <label key={duration} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
                      <span className="ml-3 text-gray-700">{duration}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
                <div className="space-y-2">
                  {locations.map((location) => (
                    <label key={location} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
                      <span className="ml-3 text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Package Type */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Package Type</h3>
                <div className="space-y-2">
                  {['All Types', 'Adventure', 'Luxury', 'Family', 'Romantic', 'Cultural'].map((type) => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
                      <span className="ml-3 text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="lg:w-3/4">
            {/* Header with sorting */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Travel Packages</h2>
                  <p className="text-gray-600 mt-1">{packages.length} packages found</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Sort by:</span>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                    <option>Most Popular</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Highest Rated</option>
                    <option>Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                        {pkg.duration}
                      </span>
                    </div>
                    <button
                      onClick={() => handleWishlist(pkg)}
                      className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white"
                    >
                      <Heart 
                        size={20} 
                        className={pkg.isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin size={14} className="mr-1" />
                          {pkg.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{pkg.price}</div>
                        <div className="text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${i < Math.floor(pkg.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-2 font-medium text-gray-900">{pkg.rating}</span>
                      </div>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-gray-600 text-sm">{pkg.reviews} reviews</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {pkg.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Inclusions */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Inclusions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {pkg.inclusions.slice(0, 3).map((inc) => (
                          <span key={inc} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                            {inc}
                          </span>
                        ))}
                        {pkg.inclusions.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{pkg.inclusions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAddToCart(pkg)}
                        className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 flex items-center justify-center"
                      >
                        <ShoppingCart size={18} className="mr-2" />
                        Add to Cart
                      </button>
                      <Link
                        href={`/packages/${pkg.id}`}
                        className="px-6 py-3 border border-primary-600 text-primary-600 rounded-xl font-medium hover:bg-primary-50 flex items-center justify-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50">
                  ←
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary-600 text-white font-medium">
                  1
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50">
                  2
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50">
                  3
                </button>
                <span className="px-2">...</span>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50">
                  8
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50">
                  →
                </button>
              </nav>
            </div>

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get a custom package designed just for you by our expert travel planners
              </p>
              <Link
                href="/custom-package"
                className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700"
              >
                Request Custom Package
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}