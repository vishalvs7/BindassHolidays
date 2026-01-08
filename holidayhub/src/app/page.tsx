import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
        <div className="relative container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your <span className="text-primary">Bindass</span> Journey Starts Here
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Discover unique travel packages and exciting activities from verified tour operators across India.
            Book with confidence, travel with freedom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/packages">
              <Button size="lg" className="px-8">
                Browse Packages
              </Button>
            </Link>
            <Link href="/activities">
              <Button size="lg" variant="outline" className="px-8">
                Explore Activities
              </Button>
            </Link>
          </div>
          
          {/* CTAs */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border">
              <h3 className="text-2xl font-bold mb-4">Design Your Itinerary</h3>
              <p className="text-muted-foreground mb-6">
                Get custom travel quotes from our expert tour operators.
              </p>
              <Link href="/custom-package">
                <Button className="w-full">Get Custom Quote</Button>
              </Link>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border">
              <h3 className="text-2xl font-bold mb-4">Corporate Travel</h3>
              <p className="text-muted-foreground mb-6">
                Specialized team travel packages for companies.
              </p>
              <Link href="/corporate">
                <Button className="w-full">Corporate Solutions</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Packages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">200+</div>
              <div className="text-muted-foreground">Activities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-muted-foreground">Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Travelers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}