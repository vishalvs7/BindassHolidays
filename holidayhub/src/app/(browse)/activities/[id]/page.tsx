'use client';

import { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  ShoppingCart,
  CheckCircle,
  Shield,
  Activity as ActivityIcon,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Award,
  Phone,
  Mail,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, saveRedirectPath } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('2024-06-18');
  const [participants, setParticipants] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  
  const activityData = {
    id: parseInt(params.id),
    title: 'Paragliding in Bir Billing',
    description: 'Experience the thrill of flying like a bird over the scenic landscapes of Himachal Pradesh. Bir Billing is one of the best paragliding sites in the world.',
    price: 3499,
    duration: '3 hours',
    location: 'Bir Billing, Himachal Pradesh',
    difficulty: 'Beginner',
    minAge: 16,
    maxParticipants: 2,
    rating: 4.9,
    reviews: 245,
    images: [
      'https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1200',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200',
    ],
    category: 'Adventure Sports',
    vendor: {
      name: 'Adventure Zone',
      rating: 4.8,
      certified: true,
      experience: '8+ years',
      contact: '+91 9876543211',
      email: 'bookings@adventurezone.com'
    },
    inclusions: [
      'Certified instructor',
      'Safety equipment (helmet, harness)',
      'GoPro video recording',
      'Transport from meeting point to takeoff site',
      'Insurance coverage',
      'Certificate of flight'
    ],
    requirements: [
      'Minimum age: 16 years',
      'Weight limit: 100 kg',
      'Medical fitness certificate',
      'Government ID proof',
      'Comfortable clothing and shoes'
    ],
    itinerary: [
      { time: '9:00 AM', title: 'Meeting Point', description: 'Arrive at the meeting point in Bir' },
      { time: '9:30 AM', title: 'Safety Briefing', description: 'Detailed safety instructions and equipment fitting' },
      { time: '10:00 AM', title: 'Transport to Takeoff', description: 'Drive to Billing takeoff site' },
      { time: '10:30 AM', title: 'Flight Time', description: 'Tandem flight with instructor (15-20 minutes)' },
      { time: '11:00 AM', title: 'Return & Video', description: 'Return to landing site and receive GoPro video' },
    ],
    faqs: [
      { question: 'Is it safe for beginners?', answer: 'Yes, all flights are tandem with certified instructors. No prior experience needed.' },
      { question: 'What if weather is bad?', answer: 'Flights are weather dependent. We offer rescheduling or full refund if cancelled due to weather.' },
      { question: 'Can I bring my own camera?', answer: 'For safety reasons, personal cameras are not allowed during flight. We provide GoPro recording.' },
    ],
    isWishlisted: true
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      saveRedirectPath();
      router.push('/register/customer');
      return;
    }
    alert(`Added ${activityData.title} to cart!`);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      saveRedirectPath();
      router.push('/register/customer');
      return;
    }
    alert(`${activityData.isWishlisted ? 'Removed from' : 'Added to'} wishlist!`);
  };

  const totalPrice = activityData.price * participants;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/activities" className="hover:text-primary-600">Activities</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 font-medium">{activityData.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:w-2/3">
            {/* Image & Header */}
            <div className="bg-white rounded-2xl overflow-hidden mb-8">
              <div className="relative h-96 bg-gradient-to-r from-blue-500 to-purple-600">
                {/* Main image - replace with actual image component */}
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                  {activityData.title}
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                      {activityData.category}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                      {activityData.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleWishlist}
                  className="absolute top-4 right-4 h-12 w-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg"
                >
                  <Heart 
                    size={24} 
                    className={activityData.isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
                  />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{activityData.title}</h1>
                    <div className="flex items-center space-x-6 text-gray-600">
                      <div className="flex items-center">
                        <MapPin size={18} className="mr-2" />
                        {activityData.location}
                      </div>
                      <div className="flex items-center">
                        <Clock size={18} className="mr-2" />
                        {activityData.duration}
                      </div>
                      <div className="flex items-center">
                        <Star size={18} className="mr-2 text-yellow-400 fill-yellow-400" />
                        {activityData.rating} ({activityData.reviews} reviews)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gray-900">₹{activityData.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  {['overview', 'itinerary', 'inclusions', 'requirements', 'faq'].map((tab) => (
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
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Activity Overview</h3>
                    <p className="text-gray-700 mb-6">{activityData.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Quick Info</h4>
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-700">
                            <Users size={18} className="text-gray-400 mr-3" />
                            Max {activityData.maxParticipants} participants per session
                          </div>
                          <div className="flex items-center text-gray-700">
                            <AlertTriangle size={18} className="text-gray-400 mr-3" />
                            Minimum age: {activityData.minAge} years
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Award size={18} className="text-gray-400 mr-3" />
                            {activityData.difficulty} level
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Safety Features</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center text-gray-700">
                            <Shield size={16} className="text-green-500 mr-2" />
                            Certified instructors
                          </li>
                          <li className="flex items-center text-gray-700">
                            <Shield size={16} className="text-green-500 mr-2" />
                            Safety equipment provided
                          </li>
                          <li className="flex items-center text-gray-700">
                            <Shield size={16} className="text-green-500 mr-2" />
                            Insurance coverage included
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Activity Schedule</h3>
                    {activityData.itinerary.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold mr-4">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <p className="text-gray-700">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'inclusions' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">What's Included</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activityData.inclusions.map((item, index) => (
                        <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                          <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Requirements & Restrictions</h3>
                    <div className="space-y-4">
                      {activityData.requirements.map((req, index) => (
                        <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-xl">
                          <AlertTriangle size={20} className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-red-50 rounded-xl">
                      <h4 className="font-semibold text-red-900 mb-3">Not Suitable For</h4>
                      <ul className="space-y-2 text-red-700">
                        <li>• Pregnant women</li>
                        <li>• People with heart conditions</li>
                        <li>• People with recent surgeries</li>
                        <li>• Those afraid of heights</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                    {activityData.faqs.map((faq, index) => (
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
              <h3 className="text-xl font-bold text-gray-900 mb-6">About the Operator</h3>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="md:w-1/4">
                  <div className="h-24 w-24 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ActivityIcon className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{activityData.vendor.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{activityData.vendor.experience} experience</div>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-6">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2" />
                      <span className="font-semibold">{activityData.vendor.rating}/5</span>
                    </div>
                    {activityData.vendor.certified && (
                      <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        <Award size={14} className="mr-2" />
                        Certified Operator
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-700">
                      <Phone size={18} className="text-gray-400 mr-3" />
                      {activityData.vendor.contact}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail size={18} className="text-gray-400 mr-3" />
                      {activityData.vendor.email}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Adventure Zone is a certified adventure sports operator with {activityData.vendor.experience} of experience in organizing safe and thrilling activities.
                  </p>
                  
                  <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50">
                    Contact Operator
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Book This Activity</h3>
                
                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>

                {/* Time Slot Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'].map((time) => (
                      <button
                        key={time}
                        className={`py-3 rounded-lg font-medium ${
                          time === '9:00 AM'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Participants Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Participants
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-xl">
                    <button
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                      disabled={participants <= 1}
                    >
                      -
                    </button>
                    <div className="flex-1 text-center py-3 font-medium">{participants}</div>
                    <button
                      onClick={() => setParticipants(Math.min(activityData.maxParticipants, participants + 1))}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                      disabled={participants >= activityData.maxParticipants}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 text-center">
                    Max {activityData.maxParticipants} participants per booking
                  </div>
                </div>

                {/* Price Summary */}
                <div className="mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per person</span>
                      <span className="font-medium">₹{activityData.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participants</span>
                      <span className="font-medium">{participants}</span>
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
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </button>
                  <button className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-medium hover:bg-blue-50">
                    Book Now
                  </button>
                </div>
              </div>

              {/* Important Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">Important</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Arrive 30 minutes before scheduled time</li>
                    <li>• Carry government ID proof</li>
                    <li>• Wear comfortable clothing and shoes</li>
                    <li>• Follow all safety instructions</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-green-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">Cancellation Policy</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>48+ hours before</span>
                      <span className="font-medium text-green-600">Full refund</span>
                    </div>
                    <div className="flex justify-between">
                      <span>24-48 hours before</span>
                      <span className="font-medium text-yellow-600">50% refund</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Less than 24 hours</span>
                      <span className="font-medium text-red-600">No refund</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Need Assistance?</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                      <Phone size={18} className="text-gray-400 mr-3" />
                      Call Support
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                      <Mail size={18} className="text-gray-400 mr-3" />
                      Email Support
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                      <Share2 size={18} className="text-gray-400 mr-3" />
                      Share Activity
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