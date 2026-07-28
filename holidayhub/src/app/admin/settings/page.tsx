'use client';

import { useState, useEffect } from 'react';
import { Globe, DollarSign, Shield, Save, CheckCircle, Loader2, Bell, Database } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase/client';

interface PlatformSettings {
  platform_name: string;
  currency: string;
  support_email: string;
  gst_percent: number;
  service_fee_percent: number;
  max_booking_qty: number;
  google_analytics_id: string;
  razorpay_configured: boolean;
  supabase_connected: boolean;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  platform_name: 'HolidayHub',
  currency: 'INR',
  support_email: 'support@holidayhub.in',
  gst_percent: 5,
  service_fee_percent: 10,
  max_booking_qty: 10,
  google_analytics_id: '',
  razorpay_configured: false,
  supabase_connected: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('admin_platform_settings');
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch { /* use defaults */ }
    }

    // Check integrations
    const supabase = getBrowserClient();
    supabase.from('profiles').select('id', { count: 'exact', head: true }).then((res: { error: unknown }) => {
      setSettings(prev => ({ ...prev, supabase_connected: !res.error }));
    });

    setSettings(prev => ({
      ...prev,
      razorpay_configured: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    }));

    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('admin_platform_settings', JSON.stringify(settings));
      // Small delay for UX
      await new Promise(r => setTimeout(r, 500));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="mt-1 text-gray-500">Global configuration for the HolidayHub platform</p>
      </div>

      {/* Integration Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <Database size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Integration Status</h2>
            <p className="text-sm text-gray-500">Connection health for external services</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className={`h-3 w-3 rounded-full ${settings.supabase_connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="text-sm font-medium text-gray-900">Supabase</p>
              <p className="text-xs text-gray-500">{settings.supabase_connected ? 'Connected' : 'Disconnected'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className={`h-3 w-3 rounded-full ${settings.razorpay_configured ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <div>
              <p className="text-sm font-medium text-gray-900">Razorpay</p>
              <p className="text-xs text-gray-500">{settings.razorpay_configured ? 'Configured' : 'Not configured'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Brevo Email</p>
              <p className="text-xs text-gray-500">Check .env.local</p>
            </div>
          </div>
        </div>
      </div>

      {/* General */}
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
              value={settings.platform_name}
              onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
            <input
              type="email"
              value={settings.support_email}
              onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Fees */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 pb-5 border-b border-gray-200">
          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <DollarSign size={20} />
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
              min={0}
              max={100}
              value={settings.gst_percent}
              onChange={(e) => setSettings({ ...settings, gst_percent: Number(e.target.value) })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Fee (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={settings.service_fee_percent}
              onChange={(e) => setSettings({ ...settings, service_fee_percent: Number(e.target.value) })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Booking Qty</label>
            <input
              type="number"
              min={1}
              max={100}
              value={settings.max_booking_qty}
              onChange={(e) => setSettings({ ...settings, max_booking_qty: Number(e.target.value) })}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 pb-5 border-b border-gray-200">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Integrations</h2>
            <p className="text-sm text-gray-500">Third-party service configuration</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Analytics ID</label>
            <input
              type="text"
              value={settings.google_analytics_id}
              onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
          <strong>Razorpay</strong> and <strong>Supabase</strong> keys are managed via <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">.env.local</code>. Restart the server after changing them.
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition disabled:opacity-70"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <CheckCircle size={16} /> Settings saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
