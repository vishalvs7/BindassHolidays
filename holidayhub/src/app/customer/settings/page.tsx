'use client';

import { useState } from 'react';
import { User, Bell, Lock, Shield, CreditCard, Globe, HelpCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

export default function CustomerSettingsPage() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    promotions: true,
    bookingUpdates: true,
    priceAlerts: false,
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'preferences', name: 'Preferences', icon: Globe },
    { id: 'help', name: 'Help', icon: HelpCircle },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center space-x-6">
                    <div className="h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center">
                      <User size={40} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{userData?.name}</h3>
                      <p className="text-gray-600">{userData?.email}</p>
                      <button className="mt-3 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        Change Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={userData?.name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        defaultValue={userData?.phone || ''}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue={userData?.email}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                      Save Changes
                    </button>
                    <button className="ml-4 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive booking updates via email</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, email: !notifications.email})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.email ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">SMS Alerts</p>
                      <p className="text-sm text-gray-600">Get booking reminders via SMS</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.sms ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Promotional Offers</p>
                      <p className="text-sm text-gray-600">Receive deals and discounts</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, promotions: !notifications.promotions})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.promotions ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.promotions ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Booking Updates</p>
                      <p className="text-sm text-gray-600">Get updates about your bookings</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, bookingUpdates: !notifications.bookingUpdates})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.bookingUpdates ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.bookingUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="pt-4">
                    <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6 max-w-2xl">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                      </div>
                      <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                    <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
                    <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-red-700 mb-4">Once you delete your account, there is no going back.</p>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other Tabs Placeholder */}
            {['privacy', 'payment', 'preferences', 'help'].includes(activeTab) && (
              <div className="text-center py-12">
                <div className="text-5xl mb-6">🚧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">This section is under development</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}