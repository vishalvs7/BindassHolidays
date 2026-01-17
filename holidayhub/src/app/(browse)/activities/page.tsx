'use client';

import { useState } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Users,
  Filter,
  Search,
  Heart,
  ShoppingCart,
  Activity as ActivityIcon,
  TrendingUp,
  Shield,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function ActivitiesPage() {
  const { isAuthenticated, saveRedirectPath } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');

  const activities = [
    {
      id: 1,
      title: 'Paragliding in Bir Billing',
      description: 'Experience the thrill of flying like a bird over the scenic landscapes of Himachal.',
      price: '₹3,499',
      duration: '3 hours',
      location: 'Bir Billing, Himachal',
      rating: 4.9,
      reviews: 245,
      image: 'https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=800',
      category: 'Adventure',
      difficulty: 'Beginner',
      minAge: 16,
      maxPeople: 2,
      isWishlisted: false,
      features: ['Certified Instructor', 'Insurance', 'GoPro Recording', 'Transport']
    },
    {
      id: 2,
      title: 'Scuba Diving - Andaman',
      description: 'Explore vibrant coral reefs and marine life with certified PADI instructors.',
      price: '₹5,999',
      duration: '4 hours',
      location: 'Havelock Island, Andaman',
      rating: 4.8,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
      category: 'Water Sports',
      difficulty: 'Beginner',
      minAge: 12,
      maxPeople: 4,
      isWishlisted: true,
      features: ['PADI Certified', 'Equipment Provided', 'Underwater Photos', 'Safety Briefing']
    },
    {
      id: 3,
      title: 'Hot Air Balloon Ride - Jaipur',
      description: 'Float over the Pink City at sunrise with breathtaking views of forts and palaces.',
      price: '₹8,500',
      duration: '2 hours',
      location: 'Jaipur, Rajasthan',
      rating: 4.7,
      reviews: 134,
      image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800',
      category: 'Sightseeing',
      difficulty: 'Easy',
      minAge: 8,
      maxPeople: 8,
      isWishlisted: false,
      features: ['Sunrise Flight', 'Champagne Toast', 'Certificate', 'Hotel Pickup']
    },
    {
      id: 4,
      title: 'White Water Rafting - Rishikesh',
      description: 'Navigate thrilling rapids on the Ganges with experienced river guides.',
      price: '₹1,999',
      duration: '3 hours',
      location: 'Rishikesh, Uttarakhand',
      rating: 4.6,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&fit=crop&w=800',
      category: 'Adventure',
      difficulty: 'Moderate',
      minAge: 14,
      maxPeople: 6,
      isWishlisted: false,
      features: ['Safety Gear', 'River Guide', 'Light Snacks', 'Changing Rooms']
    },
    {
      id: 5,
      title: 'Wildlife Safari - Jim Corbett',
      description: 'Spot tigers, elephants and diverse wildlife in their natural habitat.',
      price: '₹2,499',
      duration: '5 hours',
      location: 'Jim Corbett, Uttarakhand',
      rating: 4.5,
      reviews: 178,
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800',
      category: 'Wildlife',
      difficulty: 'Easy',
      minAge: 5,
      maxPeople: 6,
      isWishlisted: true,
      features: ['Expert Guide', 'Safari Jeep', 'Binoculars', 'Forest Permit']
    },
    {
      id: 6,
      title: 'Cooking Class - Kerala',
      description: 'Learn authentic Kerala cuisine from local chefs in a traditional setting.',
      price: '₹1,899',
      duration: '3 hours',
      location: 'Kochi, Kerala',
      rating: 4.9,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800',
      category: 'Cultural',
      difficulty: 'Easy',
      minAge: 10,
      maxPeople: 8,
      isWishlisted: false,
      features: ['Local Chef', 'Ingredients', 'Recipe Book', 'Meal Included']
    },
  ];

  const categories = [
    { id: 'all', label: 'All Activities', count: activities.length },
    { id: 'adventure', label: 'Adventure', count: 2 },
    { id: 'water', label: 'Water Sports', count: 1 },
    { id: 'sightseeing', label: 'Sightseeing', count: 1 },
    { id: 'wildlife', label: 'Wildlife', count: 1 },
    { id: 'cultural', label: 'Cultural', count: 1 },
  ];

  const filteredActivities = activeCategory === 'all' 
    ? activities 
    : activities.filter(a => a.category.toLowerCase() === activeCategory);

  const handleAddToCart = (activity: any) => {
    if (!isAuthenticated) {
      saveRedirectPath();
      router.push('/register/customer');
      return;
    }
    alert(`Added ${activity.title} to cart!`);
  };

  const handleWishlist = (activity: any) => {
    if (!isAuthenticated) {
      saveRedirectPath();
      router.push('/register/customer');
      return;
    }
    alert(`${activity.isWishlisted ? 'Removed from' : 'Added to'} wishlist!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <TrendingUp size={16} className="mr-2" />
              <span className="text-sm">Most booked activities this month</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Adventure Awaits!</h1>
            <p className="text-xl text-white/90 mb-8">
              Book thrilling activities and experiences from verified operators. Instant confirmation.
            </p>
            <div className="bg-white rounded-2xl p-2 flex items-center">
              <div className="flex-1 flex items-center px-4">
                <Search className="text-gray-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Search activities by type, location, or keyword..."
                  className="w-full py-3 outline-none text-gray-800"
                />
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Verified Operators</h3>
            <p className="text-sm text-gray-600 mt-1">Safety certified</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ActivityIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Instant Booking</h3>
            <p className="text-sm text-gray-600 mt-1">No waiting time</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Best Price</h3>
            <p className="text-sm text-gray-600 mt-1">Guaranteed</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">4.8/5 Rating</h3>
            <p className="text-sm text-gray-600 mt-1">Customer reviews</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {category.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                    {activity.category}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                    {activity.difficulty}
                  </span>
                </div>
                <button
                  onClick={() => handleWishlist(activity)}
                  className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white"
                >
                  <Heart
                    size={20}
                    className={activity.isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                  />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">{activity.title}</h3>
                  <div className="flex items-center text-white/90">
                    <MapPin size={14} className="mr-1" />
                    {activity.location}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-700">{activity.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-700">Up to {activity.maxPeople} people</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-gray-700">Age {activity.minAge}+</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{activity.price}</div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{activity.description}</p>

                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${i < Math.floor(activity.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 font-medium text-gray-900">{activity.rating}</span>
                    </div>
                    <span className="text-gray-600 text-sm">({activity.reviews} reviews)</span>
                  </div>
                  <div className="text-sm text-gray-500">Instant confirmation</div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {activity.features.slice(0, 4).map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-gray-700">
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAddToCart(activity)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Book Now
                  </button>
                  <Link
                    href={`/activities/${activity.id}`}
                    className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Notice */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Safety First</h3>
              <p className="text-gray-700 mb-4">
                All our activity operators are thoroughly vetted, certified, and follow strict safety protocols.
                Your safety is our top priority.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-3" />
                  Certified and licensed operators only
                </li>
                <li className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-3" />
                  Safety equipment regularly inspected
                </li>
                <li className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-3" />
                  Trained guides with first aid certification
                </li>
              </ul>
            </div>
            <div className="mt-8 md:mt-0">
              <div className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-16 w-16 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}