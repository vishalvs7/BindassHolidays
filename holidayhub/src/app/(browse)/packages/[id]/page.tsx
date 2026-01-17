'use client';

import { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Heart, 
  ShoppingCart,
  CheckCircle,
  Shield,
  Award,
  Package as PackageIcon,
  ChevronRight,
  Share2,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function PackageDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, saveRedirectPath } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('2024-06-15');
  const [guests, setGuests] = useState(2);
  const [activeTab, setActiveTab] = useState('overview');
  
  const packageData = {
    id: parseInt(params.id),
    title: 'Goa Beach Paradise - 4D/3N',
    description: 'Experience the ultimate beach vacation with luxury resorts, water sports, and authentic Goan cuisine. This package includes all the best that Goa has to offer.',
    price: 24999,
    originalPrice: 29999,
    duration: '4D/3N',
    location: 'Goa, India',
    rating: 4.8,
    reviews: 124,
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200',
    ],
    tags: ['Beach', 'Luxury', 'Family', 'All Inclusive'],
    vendor: {
      name: 'Sunshine Tours',
      rating: 4.9,
      verified: true,
      experience: '12+ years',
      contact: '+91 9876543210',
      email: 'info@sunshinetours.com'
    },
    inclusions: [
      { title: 'Accommodation', items: ['3 nights at 4-star beach resort', 'Sea view rooms', 'Daily housekeeping'] },
      { title: 'Meals', items: ['Daily breakfast buffet', '3 gourmet dinners', 'Welcome drink'] },
      { title: 'Activities', items: ['Water sports (jet ski, banana boat)', 'Dolphin watching cruise', 'Cultural show'] },
      { title: 'Transport', items: ['Airport transfers', 'Local sightseeing AC vehicle', 'Driver allowance'] },
    ],
    exclusions: ['Flight tickets', 'Travel insurance', 'Personal expenses', 'Alcoholic beverages'],
    itinerary: [
      { day: 1, title: 'Arrival & Beach Welcome', description: 'Arrive at Goa airport, transfer to resort, welcome drink, and evening beach stroll.' },
      { day: 2, title: 'Water Sports & Local Market', description: 'Morning water sports, afternoon visit to Anjuna flea market, evening cultural show.' },
      { day: 3, title: 'Dolphin Cruise & Fort Visit', description: 'Sunrise dolphin cruise, visit to Aguada Fort, beachside dinner.' },
      { day: 4, title: 'Departure', description: 'Leisure morning, checkout, and airport transfer.' },
    ],
    faqs: [
      { question: 'What is the cancellation policy?', answer: 'Free cancellation up to 7 days before travel. 50% refund for cancellation within 3-7 days.' },
      { question: 'Is travel insurance included?', answer: 'No, travel insurance is not included but highly recommended.' },
      { question: 'Are children allowed?', answer: 'Yes, children of all ages are welcome. Special rates available for children under 12.' },
    ],
    isWishlisted: false
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      saveRedirectPath();
      router.push('/register/customer');
      return;
    }
    alert(`Added ${packageData.title} to cart!`);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      saveRedirectPath();
      router.push('/register/customer');
      return;
    }
    alert(`${packageData.isWishlisted ? 'Removed from' : 'Added to'} wishlist!`);
  };

  const totalPrice = packageData.price * guests;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/packages" className="hover:text-primary-600">Packages</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 font-medium">{packageData.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden mb-8">
              <div className="relative h-96 bg-gradient-to-r from-blue-400 to-cyan-400">
                {/* Main image - replace with actual image component */}
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                  {packageData.title}
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex space-x-2">
                    {packageData.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleWishlist}
                  className="absolute top-4 right-4 h-12 w-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg"
                >
                  <Heart 
                    size={24} 
                    className={packageData.isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
                  />
                </button>
              </div>
            </div>

            {/* Package Header */}
            <div className="bg-white rounded-2xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{packageData.title}</h1>
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-2" />
                      {packageData.location}
                    </div>
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2" />
                      {packageData.duration}
                    </div>
                    <div className="flex items-center">
                      <Star size={18} className="mr-2 text-yellow-400 fill-yellow-400" />
                      {packageData.rating} ({packageData.reviews} reviews)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-900">₹{packageData.price.toLocaleString()}</div>
                  <div className="text-lg text-gray-500 line-through">₹{packageData.originalPrice.toLocaleString()}</div>
                  <div className="text-sm text-green-600 font-medium mt-2">Save ₹{(packageData.originalPrice - packageData.price).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  {['overview', 'itinerary', 'inclusions', 'faq', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 font-medium whitespace-nowrap ${
                        activeTab === tab
                          ? 'border-b-2 border-primary-600 text-primary-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Package Overview</h3>
                    <p className="text-gray-700 mb-6">{packageData.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {packageData.inclusions.slice(0, 2).map((category) => (
                        <div key={category.title} className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">{category.title}</h4>
                          <ul className="space-y-2">
                            {category.items.map((item) => (
                              <li key={item} className="flex items-center text-gray-700">
                                <CheckCircle size={16} className="text-green-500 mr-2" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Itinerary</h3>
                    {packageData.itinerary.map((day) => (
                      <div key={day.day} className="border-l-4 border-primary-500 pl-6 py-4">
                        <div className="flex items-center mb-2">
                          <div className="h-10 w-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold mr-4">
                            Day {day.day}
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">{day.title}</h4>
                        </div>
                        <p className="text-gray-700">{day.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'inclusions' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">What's Included</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {packageData.inclusions.map((category) => (
                        <div key={category.title} className="bg-gray-50 rounded-xl p-6">
                          <h4 className="font-semibold text-gray-900 mb-4">{category.title}</h4>
                          <ul className="space-y-3">
                            {category.items.map((item) => (
                              <li key={item} className="flex items-center">
                                <CheckCircle size={18} className="text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Exclusions</h4>
                      <div className="bg-red-50 rounded-xl p-6">
                        <ul className="space-y-3">
                          {packageData.exclusions.map((item) => (
                            <li key={item} className="flex items-center text-gray-700">
                              <div className="h-2 w-2 bg-red-500 rounded-full mr-3"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                    {packageData.faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Vendor Info */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">About the Tour Operator</h3>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="md:w-1/4">
                  <div className="h-24 w-24 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <PackageIcon className="h-12 w-12 text-primary-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{packageData.vendor.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{packageData.vendor.experience} experience</div>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-6">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2" />
                      <span className="font-semibold">{packageData.vendor.rating}/5</span>
                    </div>
                    {packageData.vendor.verified && (
                      <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        <Shield size={14} className="mr-2" />
                        Verified Operator
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-700">
                      <Phone size={18} className="text-gray-400 mr-3" />
                      {packageData.vendor.contact}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail size={18} className="text-gray-400 mr-3" />
                      {packageData.vendor.email}
                    </div>
                  </div>
                  
                  <button className="px-6 py-3 border border-primary-600 text-primary-600 rounded-xl font-medium hover:bg-primary-50">
                    Contact Vendor
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Book This Package</h3>
                
                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Travel Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>

                {/* Guests Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-xl">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center py-3 font-medium">{guests}</div>
                    <button
                      onClick={() => setGuests(guests + 1)}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per person</span>
                      <span className="font-medium">₹{packageData.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of guests</span>
                      <span className="font-medium">{guests}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">₹{totalPrice.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Inclusive of all taxes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary-600 text-white py-4 rounded-xl font-medium hover:bg-primary-700 flex items-center justify-center"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </button>
                  <button className="w-full border-2 border-primary-600 text-primary-600 py-4 rounded-xl font-medium hover:bg-primary-50">
                    Book Now
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-green-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">Secure Booking</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Your booking is protected with our secure payment system and flexible cancellation policy.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <Award className="h-6 w-6 text-blue-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">Best Price Guarantee</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Found this package cheaper elsewhere? Contact us and we'll match the price.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Need Help?</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      📞 Call: 1800-123-4567
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      💬 Live Chat
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      📧 Email Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}