'use client';

import { useState } from 'react';
import { Building2, User, Mail, Phone, Globe, CreditCard, Bell, Shield, HelpCircle } from 'lucide-react';

export default function VendorSettingsPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [settings, setSettings] = useState({
    businessName: 'Adventure Tours India',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@adventuretours.com',
    phone: '+91 9876543210',
    website: 'www.adventuretours.com',
    commissionRate: '15%',
    notifications: { email: true, sms: false, bookingAlerts: true }
  });

  const tabs = [
    { id: 'business', name: 'Business', icon: Building2 },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'help', name: 'Help', icon: HelpCircle },
  ];

  return (
    <div>
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Settings</h1><p className="text-gray-600">Manage your business settings</p></div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Icon size={20} /><span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {activeTab === 'business' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
                <div className="space-y-6 max-w-2xl">
                  {[
                    { label: 'Business Name', icon: Building2, value: settings.businessName, key: 'businessName' },
                    { label: 'Contact Person', icon: User, value: settings.contactPerson, key: 'contactPerson' },
                    { label: 'Email', icon: Mail, value: settings.email, key: 'email' },
                    { label: 'Phone', icon: Phone, value: settings.phone, key: 'phone' },
                    { label: 'Website', icon: Globe, value: settings.website, key: 'website' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <field.icon size={16} className="mr-2" />{field.label}
                      </label>
                      <input type="text" value={field.value} onChange={(e) => setSettings({...settings, [field.key]: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                    </div>
                  ))}
                  <div className="pt-4"><button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">Save Changes</button></div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="text-center py-12"><User size={64} className="text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Settings</h3><p className="text-gray-600">Coming soon</p>
              </div>
            )}

            {['payment', 'notifications', 'security', 'help'].includes(activeTab) && (
              <div className="text-center py-12">
                <div className="text-5xl mb-6">🚧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Under Development</h3>
                <p className="text-gray-600">This section will be available soon</p>
              </div>
            )}
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-semibold text-yellow-900 mb-3">⚠️ Account Verification</h3>
            <p className="text-yellow-800 mb-4">Complete your business verification to access all features</p>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-white border border-yellow-300 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2">Documents Required</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Business Registration Certificate</li>
                  <li>• GSTIN Certificate</li>
                  <li>• Bank Account Details</li>
                </ul>
              </div>
              <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium">Start Verification</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}