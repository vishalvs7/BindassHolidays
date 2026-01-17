'use client';

import { useState } from 'react';
import { MapPin, Calendar, Users, DollarSign, MessageSquare, Send } from 'lucide-react';

export default function CustomerCustomPackagePage() {
  const [formData, setFormData] = useState({
    destination: '',
    travelDates: '',
    travelers: '2',
    budget: '',
    preferences: '',
    specialRequirements: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Custom package request submitted! Our experts will contact you within 24 hours.');
    setFormData({
      destination: '',
      travelDates: '',
      travelers: '2',
      budget: '',
      preferences: '',
      specialRequirements: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Design Your Itinerary</h1>
        <p className="text-gray-600 mt-2">Get custom travel quotes from our expert tour operators</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full mb-4">
                <span className="font-medium">✨ Premium Service</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Tell us about your dream trip</h2>
              <p className="text-gray-600 mt-2">Fill in the details and our experts will create a personalized itinerary</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Destination(s)
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g., Goa, Kerala, Himachal"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Travel Dates & Travelers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Travel Dates
                  </label>
                  <input
                    type="text"
                    name="travelDates"
                    value={formData.travelDates}
                    onChange={handleChange}
                    placeholder="e.g., June 15-20, 2024"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users size={16} className="inline mr-2" />
                    Number of Travelers
                  </label>
                  <select
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                    ))}
                    <option value="10+">10+ People (Group)</option>
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-2" />
                  Approximate Budget (per person)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₹</span>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., 25,000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-4 mt-3">
                  {['₹10k-20k', '₹20k-30k', '₹30k-50k', '₹50k+'].map(range => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setFormData({...formData, budget: range})}
                      className={`px-4 py-2 rounded-lg border ${
                        formData.budget === range 
                          ? 'border-primary-600 bg-primary-50 text-primary-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Preferences
                </label>
                <textarea
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., Luxury hotels, adventure activities, local cuisine experiences, cultural tours..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare size={16} className="inline mr-2" />
                  Special Requirements
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., Dietary restrictions, accessibility needs, special occasions..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-lg flex items-center justify-center space-x-3"
                >
                  <Send size={20} />
                  <span>Submit Request to Experts</span>
                </button>
                <p className="text-center text-gray-500 text-sm mt-3">
                  Our experts will contact you within 24 hours with custom quotes
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Benefits & Process Sidebar */}
        <div className="space-y-6">
          {/* Benefits Card */}
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Custom Planning?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Personalized itinerary matching your interests</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Multiple quotes from verified operators</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Best price guarantee</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">24/7 expert support</span>
              </li>
            </ul>
          </div>

          {/* Process Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">How It Works</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Submit Request</h4>
                  <p className="text-sm text-gray-600">Tell us about your travel preferences</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Get Custom Quotes</h4>
                  <p className="text-sm text-gray-600">Receive 3-5 personalized quotes</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Choose & Book</h4>
                  <p className="text-sm text-gray-600">Select your favorite and book securely</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Planning Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Savings</span>
                <span className="font-semibold text-green-600">15-25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold">Within 24 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Satisfaction Rate</span>
                <span className="font-semibold">94%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}