'use client';

import { useState } from 'react';
import { Globe, Currency, Bell, Shield, Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    platformName: 'HolidayHub',
    currency: 'INR',
    supportEmail: 'support@holidayhub.in',
    gstPercent: 5,
    serviceFeePercent: 10,
    maxBookingQty: 10,
    googleAnalyticsId: '',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="mt-1 text-gray-500">Global configuration for the HolidayHub platform</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 pb-5 border-b border-gray-200">
          <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">General</h2>
            <p className="text-sm text-gray-500">Basic platform information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform Name</label>
            <input
              type="text"
              value={form.platformName}
              onChange={(e) => setForm({ ...form, platformName: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
            <input
              type="email"
              value={form.supportEmail}
              onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 pb-5 border-b border-gray-200">
          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <Currency size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Pricing & Fees</h2>
            <p className="text-sm text-gray-500">Tax and service fee configuration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">GST (%)</label>
            <input
              type="number"
              value={form.gstPercent}
              onChange={(e) => setForm({ ...form, gstPercent: Number(e.target.value) })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Fee (%)</label>
            <input
              type="number"
              value={form.serviceFeePercent}
              onChange={(e) => setForm({ ...form, serviceFeePercent: Number(e.target.value) })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Booking Qty</label>
            <input
              type="number"
              value={form.maxBookingQty}
              onChange={(e) => setForm({ ...form, maxBookingQty: Number(e.target.value) })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 pb-5 border-b border-gray-200">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Integrations</h2>
            <p className="text-sm text-gray-500">Third-party service keys</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Analytics ID</label>
            <input
              type="text"
              value={form.googleAnalyticsId}
              onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
          <strong>Razorpay</strong> and <strong>Supabase</strong> keys are managed via <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">.env.local</code>.
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition"
        >
          <Save size={18} /> Save Settings
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-pulse">
            <CheckCircle size={16} /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
