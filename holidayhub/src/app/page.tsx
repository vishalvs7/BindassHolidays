import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Shield, 
  Star, 
  MapPin, 
  Users, 
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  Plane,
  Mountain,
  Building,
  Package as PackageIcon
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-indigo-50" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000" />
        
        <div className="relative container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Star className="h-4 w-4 fill-current" />
            Trusted by 10,000+ Indian Travelers
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="text-primary-600">Bindass</span> Your Way
            <br />
            Across Incredible India
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            From Himalayan treks to beach getaways. Curated experiences from verified local operators.
            Book with confidence, travel with freedom.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/packages">
              <Button size="lg" className="px-10 py-6 text-lg bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200">
                <MapPin className="mr-3 h-5 w-5" />
                Browse Packages
              </Button>
            </Link>
            <Link href="/activities">
              <Button size="lg" variant="outline" className="px-10 py-6 text-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-50">
                <Mountain className="mr-3 h-5 w-5" />
                Explore Activities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Curated Packages', icon: <PackageIcon className="h-8 w-8" /> },
              { number: '200+', label: 'Adventure Activities', icon: <Mountain className="h-8 w-8" /> },
              { number: '100+', label: 'Verified Vendors', icon: <Shield className="h-8 w-8" /> },
              { number: '10K+', label: 'Happy Travelers', icon: <Users className="h-8 w-8" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose Bindass Holiday?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're redefining travel experiences with transparency and trust
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-10 w-10" />,
                title: 'Verified Operators Only',
                description: 'Every vendor is background-checked and verified. No hidden surprises.',
                color: 'text-green-600',
                bg: 'bg-green-50'
              },
              {
                icon: <Calendar className="h-10 w-10" />,
                title: 'Flexible Booking',
                description: 'Easy rescheduling and 24/7 support. Travel on your terms.',
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                icon: <TrendingUp className="h-10 w-10" />,
                title: 'Best Price Guarantee',
                description: 'Found a better price? We\'ll match it. No questions asked.',
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${item.bg} ${item.color} rounded-2xl mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <Building className="h-12 w-12 opacity-80" />
                <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium">Business</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Corporate Travel Solutions</h3>
              <p className="text-primary-100 mb-6">
                Tailored group packages for team offsites, client meetings, and incentive travel.
              </p>
              <ul className="space-y-2 mb-8">
                {['Custom itineraries', 'Bulk discounts', 'Dedicated support', 'Flexible payments'].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/corporate">
                <Button className="w-full bg-white text-primary-700 hover:bg-gray-100">
                  Explore Corporate Plans
                </Button>
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <Plane className="h-12 w-12 opacity-80" />
                <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium">Custom</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Design Your Dream Trip</h3>
              <p className="text-amber-100 mb-6">
                Can't find what you're looking for? Get a custom itinerary from expert planners.
              </p>
              <ul className="space-y-2 mb-8">
                {['Personalized quotes', 'Local expert advice', 'Flexible dates', 'Special requests'].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/custom-package">
                <Button className="w-full bg-white text-amber-700 hover:bg-gray-100">
                  Get Custom Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Simple Booking Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From dreaming to destination in just a few clicks
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-primary-200" />
            
            {[
              { step: '01', title: 'Browse & Select', description: 'Explore curated packages or activities', icon: <MapPin className="h-8 w-8" /> },
              { step: '02', title: 'Book Instantly', description: 'Secure booking with flexible options', icon: <Calendar className="h-8 w-8" /> },
              { step: '03', title: 'Travel Bindass', description: 'Enjoy with 24/7 support throughout', icon: <Shield className="h-8 w-8" /> }
            ].map((item, index) => (
              <div key={index} className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  {item.step}
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl mb-6 mt-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/register/customer">
              <Button size="lg" className="px-12 bg-primary-600 hover:bg-primary-700">
                Start Your Journey
              </Button>
            </Link>
            <p className="text-gray-500 mt-4 text-sm">
              Join 10,000+ travelers who trust us with their adventures
            </p>
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-900 to-purple-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                <Building className="h-4 w-4" />
                For Tour Operators
              </div>
              <h2 className="text-4xl font-bold mb-6">Grow Your Travel Business With Us</h2>
              <p className="text-lg text-primary-200 mb-8">
                Reach thousands of travelers, manage bookings effortlessly, and focus on creating amazing experiences.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Zero setup fees, commission-based model',
                  'Real-time booking management',
                  'Marketing & visibility boost',
                  'Secure payment processing'
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-300" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register/vendor">
                  <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
                    Join as Vendor
                  </Button>
                </Link>
                <Link href="/vendor-benefits">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Vendor Success Stories</h3>
              <div className="space-y-6">
                {[
                  { name: 'Adventure Himalayas', growth: '3x bookings in 6 months' },
                  { name: 'Goa Beach Tours', growth: '95% customer satisfaction' },
                  { name: 'Kerala Backwaters', growth: '₹50L+ revenue generated' }
                ].map((story, i) => (
                  <div key={i} className="flex items-center p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold">{story.name}</div>
                      <div className="text-sm text-primary-200">{story.growth}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}