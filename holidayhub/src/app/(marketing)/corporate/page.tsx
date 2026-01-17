import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Building, 
  Users,
  Shield,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  CheckCircle,
  Plane,
  Hotel,
  Briefcase,
  Calendar
} from 'lucide-react';

export default function CorporatePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Building className="h-4 w-4" />
              Enterprise Solutions
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Corporate Travel Solutions
            </h1>
            <p className="text-xl text-primary-100 mb-10 leading-relaxed">
              Streamlined travel management for businesses of all sizes. 
              From team offsites to client meetings, we handle everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contact-form">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 px-8">
                  Request Enterprise Plan
                </Button>
              </Link>
              <Link href="#solutions">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                  View Solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Tailored for Your Business</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solutions designed for different corporate needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Team Offsites & Retreats',
                description: 'Bonding experiences that boost team morale',
                features: ['Adventure activities', 'Meeting facilities', 'Accommodation', 'Transport'],
                icon: <Users className="h-8 w-8" />,
                color: 'bg-primary-50 text-primary-600'
              },
              {
                title: 'Client Meetings & Events',
                description: 'Impress clients with exceptional hospitality',
                features: ['Luxury stays', 'Fine dining', 'Local experiences', 'Logistics'],
                icon: <Briefcase className="h-8 w-8" />,
                color: 'bg-purple-50 text-purple-600'
              },
              {
                title: 'Incentive Travel',
                description: 'Reward top performers with memorable trips',
                features: ['Premium packages', 'Custom itineraries', 'VIP treatment', 'Gifting'],
                icon: <Award className="h-8 w-8" />,
                color: 'bg-amber-50 text-amber-600'
              }
            ].map((solution, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${solution.color} rounded-2xl mb-6`}>
                  {solution.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                <ul className="space-y-3">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Why Businesses Choose Us
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <DollarSign className="h-6 w-6" />,
                    title: 'Cost Savings',
                    description: 'Bulk discounts and optimized travel plans reduce expenses'
                  },
                  {
                    icon: <Clock className="h-6 w-6" />,
                    title: 'Time Efficiency',
                    description: 'Single point of contact for all travel needs'
                  },
                  {
                    icon: <Shield className="h-6 w-6" />,
                    title: 'Risk Management',
                    description: '24/7 support and emergency assistance'
                  },
                  {
                    icon: <TrendingUp className="h-6 w-6" />,
                    title: 'Policy Compliance',
                    description: 'Ensure travel aligns with company policies'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
                      <div className="text-primary-600">{benefit.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-6">Enterprise Features</h3>
              <div className="space-y-4">
                {[
                  'Dedicated account manager',
                  'Custom travel portal',
                  'Monthly consolidated billing',
                  'Travel analytics & reporting',
                  'Employee self-booking tools',
                  'Multi-level approval workflows'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section id="contact-form" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-primary-600 to-purple-700 rounded-2xl p-8 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Request Enterprise Consultation</h2>
              <p className="text-primary-100">
                Our corporate travel specialists will contact you within 2 business hours
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Employee Size</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white">
                    <option>1-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-1000 employees</option>
                    <option>1000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="email@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Travel Needs</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                  rows={3}
                  placeholder="Tell us about your corporate travel requirements..."
                />
              </div>

              <Button type="submit" className="w-full bg-white text-primary-700 hover:bg-gray-100 py-6 text-lg">
                Request Enterprise Plan
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}