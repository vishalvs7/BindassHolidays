'use client';

import { useState } from 'react';
import { 
  Lock, 
  Shield, 
  CreditCard, 
  Wallet, 
  Truck, 
  CheckCircle,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';

export default function CheckoutPage() {
  const { userData } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const cartItems = [
    {
      id: 1,
      title: 'Goa Beach Paradise - 4D/3N',
      type: 'package',
      date: '2024-06-15',
      guests: 2,
      price: 24999,
      vendor: 'Sunshine Tours'
    },
    {
      id: 2,
      title: 'Paragliding in Bir Billing',
      type: 'activity',
      date: '2024-06-18',
      guests: 1,
      price: 3499,
      vendor: 'Adventure Zone'
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const taxes = subtotal * 0.18;
  const platformFee = 199;
  const total = subtotal + taxes + platformFee;

  const handleCheckout = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    alert('Booking confirmed! Redirecting to payment...');
    // Implement actual payment logic here
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="ml-4">
              <div className="font-semibold text-gray-900">Cart</div>
              <div className="text-sm text-gray-600">Review items</div>
            </div>
          </div>
          
          <div className="h-1 flex-1 bg-primary-600 mx-4"></div>
          
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="ml-4">
              <div className="font-semibold text-gray-900">Checkout</div>
              <div className="text-sm text-gray-600">Enter details</div>
            </div>
          </div>
          
          <div className="h-1 flex-1 bg-gray-200 mx-4"></div>
          
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="ml-4">
              <div className="font-semibold text-gray-900">Payment</div>
              <div className="text-sm text-gray-600">Secure payment</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Forms */}
        <div className="lg:w-2/3">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={userData?.name || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={userData?.email || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue={userData?.phone || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Traveler Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Traveler Details</h2>
            {cartItems.map((item, index) => (
              <div key={item.id} className="mb-6 last:mb-0">
                <div className="flex items-center mb-4">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center mr-3 ${
                    item.type === 'package' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {item.type === 'package' ? '📦' : '⚡'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">
                      {item.date} • {item.guests} guest{item.guests !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[...Array(item.guests)].map((_, guestIndex) => (
                    <div key={guestIndex} className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm font-medium text-gray-900 mb-3">
                        Traveler {guestIndex + 1}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Age"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        />
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                          <option>Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                        <input
                          type="text"
                          placeholder="ID Proof Number"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
            <div className="space-y-4">
              {[
                { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                { id: 'upi', label: 'UPI', icon: Wallet },
                { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                { id: 'wallet', label: 'Wallet', icon: '👛' },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="ml-4 flex items-center">
                    {typeof method.icon === 'string' ? (
                      <span className="text-2xl mr-3">{method.icon}</span>
                    ) : (
                      <method.icon className="h-6 w-6 text-gray-600 mr-3" />
                    )}
                    <span className="font-medium text-gray-900">{method.label}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Card Details (shown when card is selected) */}
            {paymentMethod === 'card' && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500 mt-1"
              />
              <div className="ml-3">
                <span className="font-medium text-gray-900">
                  I agree to the Terms & Conditions and Privacy Policy
                </span>
                <p className="text-sm text-gray-600 mt-2">
                  By proceeding, you agree to our cancellation policy, terms of service, and confirm that you have read and understood all details about your booking.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Items List */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">
                        {item.date} • {item.guests} guest{item.guests !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500">Vendor: {item.vendor}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ₹{item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes (18%)</span>
                  <span className="font-medium">₹{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">₹{platformFee.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Inclusive of all taxes</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!agreedToTerms}
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center ${
                  agreedToTerms
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Lock size={20} className="mr-2" />
                Complete Booking
              </button>
            </div>

            {/* Security & Benefits */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">Secure Booking</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    SSL encrypted payment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    No hidden charges
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Instant confirmation
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Truck className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">Flexible Cancellation</h3>
                </div>
                <p className="text-sm text-gray-700">
                  Free cancellation up to 48 hours before travel date. Full refund within 24 hours of booking.
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/cart"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}