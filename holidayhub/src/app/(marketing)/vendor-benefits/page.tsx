import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  BarChart,
  Clock,
  Smartphone,
  CheckCircle,
  Star,
  Building,
  Package,
  Headphones
} from 'lucide-react';

export default function VendorBenefitsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Building className="h-4 w-4" />
              For Tour Operators
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Grow Your Travel Business
            </h1>
            <p className="text-xl text-primary-100 mb-10 leading-relaxed">
              Join India's fastest-growing travel marketplace. 
              Reach more travelers, increase bookings, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register/vendor">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 px-8">
                  Register as Vendor
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Partner With Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed in the digital travel marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="h-10 w-10" />,
                title: 'Increased Visibility',
                description: 'Reach thousands of active travelers across India',
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                icon: <DollarSign className="h-10 w-10" />,
                title: 'Higher Earnings',
                description: 'Competitive commissions and flexible pricing',
                color: 'text-green-600',
                bg: 'bg-green-50'
              },
              {
                icon: <Shield className="h-10 w-10" />,
                title: 'Secure Payments',
                description: 'Timely payouts and payment protection',
                color: 'text-primary-600',
                bg: 'bg-primary-50'
              },
              {
                icon: <BarChart className="h-10 w-10" />,
                title: 'Business Insights',
                description: 'Analytics dashboard to track performance',
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              },
              {
                icon: <Clock className="h-10 w-10" />,
                title: 'Time Savings',
                description: 'Automated booking and management tools',
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: 'Marketing Support',
                description: 'Promotion across our channels',
                color: 'text-pink-600',
                bg: 'bg-pink-50'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
                <div className={`inline-flex items-center justify-center w-20 h-20 ${benefit.bg} ${benefit.color} rounded-2xl mb-6 mx-auto`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Simple Onboarding Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in just a few steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Register',
                description: 'Create your vendor account',
                icon: '📝'
              },
              {
                step: '02',
                title: 'Verify',
                description: 'Complete KYC verification',
                icon: '✅'
              },
              {
                step: '03',
                title: 'List',
                description: 'Add your packages & activities',
                icon: '📦'
              },
              {
                step: '04',
                title: 'Start Earning',
                description: 'Receive bookings & payments',
                icon: '💰'
              }
            ].map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-xl font-bold mb-6">
                  {step.step}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pay only when you earn. No setup fees, no monthly charges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Standard',
                commission: '15%',
                features: [
                  'Dashboard access',
                  'Basic listing',
                  'Payment processing',
                  'Email support'
                ],
                color: 'border-gray-200'
              },
              {
                title: 'Professional',
                commission: '12%',
                popular: true,
                features: [
                  'Everything in Standard',
                  'Priority placement',
                  'Advanced analytics',
                  'Phone support',
                  'Marketing boost'
                ],
                color: 'border-primary-600 border-2'
              },
              {
                title: 'Enterprise',
                commission: 'Custom',
                features: [
                  'Everything in Professional',
                  'API access',
                  'Dedicated manager',
                  'Custom reporting',
                  'Bulk upload tools'
                ],
                color: 'border-gray-200'
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg p-8 ${plan.color} relative`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.commission}</span>
                  {plan.commission !== 'Custom' && <span className="text-gray-600 ml-2">per booking</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register/vendor">
                  <Button className={`w-full ${plan.popular ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-900 hover:bg-black'}`}>
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
            Join 100+ successful tour operators already on our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/vendor">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 px-8">
                Start Free Registration
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
              Book a Demo Call
            </Button>
          </div>
          <p className="text-sm text-primary-200 mt-8">
            No credit card required • Get approved in 24-48 hours
          </p>
        </div>
      </section>
    </div>
  );
}