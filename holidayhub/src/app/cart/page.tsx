'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  Trash2,
  Heart,
  Package,
  Activity as ActivityIcon,
  Plus,
  Minus,
  Shield,
  Lock,
  ArrowRight,
  Tag,
  CreditCard,
  Truck,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      type: 'package',
      title: 'Goa Beach Paradise - 4D/3N',
      location: 'Goa, India',
      duration: '4D/3N',
      date: '2024-06-15',
      guests: 2,
      price: 24999,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400',
      vendor: 'Sunshine Tours',
      isWishlisted: false
    },
    {
      id: 2,
      type: 'activity',
      title: 'Paragliding in Bir Billing',
      location: 'Bir Billing, Himachal',
      duration: '3 hours',
      date: '2024-06-18',
      guests: 1,
      price: 3499,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=400',
      vendor: 'Adventure Zone',
      isWishlisted: true
    },
    {
      id: 3,
      type: 'package',
      title: 'Kerala Backwaters Houseboat',
      location: 'Alleppey, Kerala',
      duration: '3D/2N',
      date: '2024-07-10',
      guests: 3,
      price: 18500,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400',
      vendor: 'Kerala Experiences',
      isWishlisted: false
    },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const toggleWishlist = (id: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, isWishlisted: !item.isWishlisted }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = subtotal * 0.18;
  const platformFee = 199;
  const total = subtotal + taxes + platformFee;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your cart</h2>
          <p className="text-gray-600 mb-8">Please sign in to view and manage your cart items</p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700"
            >
              Sign In
            </Link>
            <div>
              <p className="text-gray-600 mb-2">New customer?</p>
              <Link
                href="/register/customer"
                className="inline-block px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-xl font-medium hover:bg-primary-50"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:w-2/3">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>

            {/* Cart Items */}
            {cartItems.length > 0 ? (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Image */}
                        <div className="md:w-1/3">
                          <div className="relative h-48 rounded-xl overflow-hidden">
                            <div className="absolute top-3 left-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                item.type === 'package'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {item.type === 'package' ? 'Package' : 'Activity'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="md:w-2/3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                {item.type === 'package' ? (
                                  <Package size={16} className="mr-2" />
                                ) : (
                                  <ActivityIcon size={16} className="mr-2" />
                                )}
                                <span>{item.location}</span>
                              </div>
                              <div className="text-gray-600 mb-4">
                                <div className="flex items-center mb-1">
                                  <Calendar size={16} className="mr-2" />
                                  <span>{item.date} • {item.duration} • {item.guests} guest{item.guests !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="text-sm">Vendor: {item.vendor}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ₹{item.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">per person</div>
                            </div>
                          </div>

                          {/* Quantity & Actions */}
                          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              <div className="text-lg font-semibold text-gray-900">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => toggleWishlist(item.id)}
                                className={`p-2 rounded-lg ${
                                  item.isWishlisted
                                    ? 'text-red-500 bg-red-50'
                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                }`}
                              >
                                <Heart size={18} className={item.isWishlisted ? 'fill-red-500' : ''} />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center">
                <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Looks like you haven't added any travel packages or activities to your cart yet.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/packages"
                    className="px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700"
                  >
                    Browse Packages
                  </Link>
                  <Link
                    href="/activities"
                    className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-xl font-medium hover:bg-primary-50"
                  >
                    Explore Activities
                  </Link>
                </div>
              </div>
            )}

            {/* Continue Shopping */}
            {cartItems.length > 0 && (
              <div className="mt-8 flex justify-between items-center">
                <Link
                  href="/packages"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  ← Continue shopping
                </Link>
                <button
                  onClick={() => setCartItems([])}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Clear cart
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
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

                <button className="w-full bg-primary-600 text-white py-4 rounded-xl font-medium hover:bg-primary-700 flex items-center justify-center mb-4">
                  Proceed to Checkout
                  <ArrowRight size={20} className="ml-2" />
                </button>

                <div className="text-center text-sm text-gray-500">
                  Free cancellation up to 48 hours before travel date
                </div>
              </div>

              {/* Payment Security */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
                <div className="flex items-start mb-4">
                  <Lock className="h-6 w-6 text-green-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Secure Payment</h3>
                    <p className="text-sm text-gray-600">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {['Visa', 'MasterCard', 'Razorpay', 'UPI'].map((method) => (
                    <div key={method} className="h-8 px-3 bg-white rounded-lg flex items-center justify-center text-sm font-medium">
                      {method}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Why Book With Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Best Price Guarantee</div>
                      <div className="text-sm text-gray-600">Find a lower price? We'll match it</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Easy Cancellation</div>
                      <div className="text-sm text-gray-600">Free cancellation on most bookings</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Secure Payments</div>
                      <div className="text-sm text-gray-600">Your data is protected with SSL</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <Tag className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="font-medium text-gray-900">Have a promo code?</span>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                  <button className="px-6 bg-primary-600 text-white rounded-r-xl font-medium hover:bg-primary-700">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        {cartItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Desert Safari - Rajasthan',
                  price: '₹4,999',
                  duration: '1 Day',
                  type: 'activity'
                },
                {
                  title: 'Ladakh Bike Trip',
                  price: '₹32,500',
                  duration: '8D/7N',
                  type: 'package'
                },
                {
                  title: 'Spa & Wellness Retreat',
                  price: '₹12,999',
                  duration: '3D/2N',
                  type: 'package'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <div className="text-sm text-gray-600 mt-1">{item.duration}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.type === 'package' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-900">{item.price}</div>
                    <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Calendar component placeholder
const Calendar = ({ size, className }: { size: number, className: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);