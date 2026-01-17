import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Heart, 
  Target, 
  Users, 
  Globe,
  Award,
  TrendingUp,
  Shield,
  Star
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary-50 via-white to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4 fill-current" />
              Our Story
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Redefining Travel in India
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Bindass Holiday was born from a simple idea: travel should be hassle-free, 
              authentic, and accessible to everyone. We bridge the gap between passionate 
              local tour operators and adventurous travelers.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border border-primary-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-2xl mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                To democratize travel experiences by connecting travelers directly with verified 
                local experts, ensuring authenticity, safety, and value in every journey.
              </p>
              <ul className="space-y-3">
                {['Transparent pricing', 'Verified partners', '24/7 traveler support', 'Sustainable tourism'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl border border-indigo-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl mb-6">
                <Globe className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h2>
              <p className="text-gray-600 mb-4">
                To become India's most trusted travel platform where every journey begins 
                with confidence and ends with unforgettable memories.
              </p>
              <ul className="space-y-3">
                {['Pan-India coverage', '10,000+ operators', '1M+ travelers annually', 'AI-powered personalization'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-10 w-10" />,
                title: 'Trust & Safety',
                description: 'Every operator undergoes rigorous verification. Your safety is our priority.',
                color: 'text-green-600',
                bg: 'bg-green-50'
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: 'Community First',
                description: 'We empower local operators and create authentic travel experiences.',
                color: 'text-primary-600',
                bg: 'bg-primary-50'
              },
              {
                icon: <TrendingUp className="h-10 w-10" />,
                title: 'Transparency',
                description: 'No hidden charges. Clear pricing and honest reviews from real travelers.',
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
                <div className={`inline-flex items-center justify-center w-20 h-20 ${value.bg} ${value.color} rounded-2xl mb-6 mx-auto`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-5xl font-bold text-primary-600 mb-4">50+</div>
              <div className="text-gray-700 font-medium">Team Members</div>
              <p className="text-gray-500 text-sm mt-2">Across 6 Indian cities</p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl font-bold text-primary-600 mb-4">28</div>
              <div className="text-gray-700 font-medium">States Covered</div>
              <p className="text-gray-500 text-sm mt-2">Pan-India presence</p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl font-bold text-primary-600 mb-4">4.8</div>
              <div className="text-gray-700 font-medium">Average Rating</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Growing Community</h2>
          <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
            Whether you're a traveler seeking adventures or a tour operator looking to grow, 
            we have a place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/customer">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 px-8">
                Start Traveling
              </Button>
            </Link>
            <Link href="/register/vendor">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Join as Vendor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}