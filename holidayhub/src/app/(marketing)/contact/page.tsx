'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageSquare,
  Send,
  Headphones,
  Globe
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary-50 via-white to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <Headphones className="h-4 w-4" />
              We're Here to Help
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Have questions? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Mail className="h-8 w-8" />,
                title: 'Email Us',
                details: ['support@bindassholiday.com', 'sales@bindassholiday.com'],
                action: 'mailto:support@bindassholiday.com'
              },
              {
                icon: <Phone className="h-8 w-8" />,
                title: 'Call Us',
                details: ['Customer Support: +91 98765 43210', 'Sales: +91 98765 43211'],
                action: 'tel:+919876543210'
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: 'Visit Us',
                details: ['Bindass Holiday HQ', '123 Travel Street, Mumbai', 'Maharashtra 400001'],
                action: 'https://maps.google.com'
              }
            ].map((info, index) => (
              <a 
                key={index} 
                href={info.action}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl mb-6">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </a>
            ))}
          </div>

          {/* Form & Info Grid */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <MessageSquare className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-bold">Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <Input 
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <Input 
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input 
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <select 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      >
                        <option value="">Select a topic</option>
                        <option value="booking">Booking Inquiry</option>
                        <option value="support">Customer Support</option>
                        <option value="vendor">Vendor Partnership</option>
                        <option value="corporate">Corporate Travel</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Message</label>
                    <Textarea 
                      placeholder="How can we help you?"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full py-6 bg-primary-600 hover:bg-primary-700">
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-8">
              {/* Hours */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-primary-600" />
                  <h3 className="text-lg font-bold">Business Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      Emergency support available 24/7 for active bookings
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-6 w-6 text-primary-600" />
                  <h3 className="text-lg font-bold">Quick Links</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Help Center', href: '/help' },
                    { label: 'Booking FAQs', href: '/faq' },
                    { label: 'Cancellation Policy', href: '/cancellation' },
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Terms of Service', href: '/terms' }
                  ].map((link, i) => (
                    <a 
                      key={i} 
                      href={link.href}
                      className="block text-gray-600 hover:text-primary-600 hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="bg-gradient-to-r from-primary-600 to-purple-700 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                <p className="text-primary-100 mb-4">
                  Stay updated with travel tips and offers
                </p>
                <div className="flex gap-4">
                  {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                    <button 
                      key={social}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                    >
                      {social.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map would go here</p>
                <p className="text-sm text-gray-500 mt-2">Mumbai, Maharashtra</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold mb-2">Our Headquarters</h3>
              <p className="text-gray-600">
                123 Travel Street, Near Gateway of India, Mumbai, Maharashtra 400001
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}