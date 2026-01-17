'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { 
  MapPin, 
  Calendar,
  Users,
  DollarSign,
  MessageSquare,
  CheckCircle,
  Plane,
  Hotel,
  Utensils,
  Car
} from 'lucide-react';

export default function CustomPage() {
  const [formData, setFormData] = useState({
    destination: '',
    travelers: '',
    duration: '',
    budget: '',
    dates: '',
    interests: '',
    specialRequests: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Custom request:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-6">
              <Plane className="h-4 w-4" />
              Tailor-Made Experiences
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Design Your Dream Trip
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Can't find what you're looking for? Our travel experts will create a 
              personalized itinerary just for you.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: '01',
                title: 'Share Your Vision',
                description: 'Tell us about your dream trip',
                icon: <MessageSquare className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'Expert Curation',
                description: 'Our specialists design your itinerary',
                icon: <CheckCircle className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Review & Book',
                description: 'Finalize and start packing!',
                icon: <Plane className="h-8 w-8" />
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-full text-lg font-bold mb-4">
                  {item.step}
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Tell Us About Your Trip</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <MapPin className="h-4 w-4" />
                    Destination(s)
                  </label>
                  <Input 
                    placeholder="e.g., Goa, Ladakh, Kerala"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar className="h-4 w-4" />
                    Preferred Dates
                  </label>
                  <Input 
                    type="text"
                    placeholder="e.g., December 15-25, 2024"
                    value={formData.dates}
                    onChange={(e) => setFormData({...formData, dates: e.target.value})}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Users className="h-4 w-4" />
                    Number of Travelers
                  </label>
                  <Input 
                    type="number"
                    placeholder="e.g., 4"
                    value={formData.travelers}
                    onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="h-4 w-4" />
                    Approximate Budget
                  </label>
                  <Input 
                    placeholder="e.g., ₹50,000 per person"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (Days)</label>
                <Input 
                  placeholder="e.g., 7 days, 6 nights"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Interests & Activities</label>
                <Textarea 
                  placeholder="e.g., Adventure sports, cultural sites, beach relaxation, local cuisine..."
                  rows={3}
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Requests</label>
                <Textarea 
                  placeholder="e.g., Honeymoon trip, family-friendly, luxury accommodations..."
                  rows={3}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Information</label>
                <Input 
                  placeholder="Email or phone number"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  required
                />
              </div>

              <Button type="submit" className="w-full py-6 text-lg bg-amber-600 hover:bg-amber-700">
                Submit Custom Request
              </Button>

              <p className="text-center text-sm text-gray-500">
                Our travel expert will contact you within 24 hours with initial ideas.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Custom Planning?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Hotel className="h-8 w-8" />,
                title: 'Preferred Stays',
                description: 'Hotels that match your style'
              },
              {
                icon: <Utensils className="h-8 w-8" />,
                title: 'Local Dining',
                description: 'Authentic culinary experiences'
              },
              {
                icon: <Car className="h-8 w-8" />,
                title: 'Private Transport',
                description: 'Comfortable travel between locations'
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: 'Hidden Gems',
                description: 'Access to exclusive local spots'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}