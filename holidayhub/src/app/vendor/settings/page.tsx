'use client';

import { useState, useEffect } from 'react';
import { Building2, User, CreditCard, Bell, Shield, HelpCircle, CheckCircle, AlertCircle, Camera, Wallet, ExternalLink, ChevronRight, MessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { getBrowserClient } from '@/lib/supabase/client';

export default function VendorSettingsPage() {
  const { vendorData, userData, updateVendor, updateProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('business');
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const tabs = [
    { id: 'business', name: 'Business', icon: Building2 },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'help', name: 'Help', icon: HelpCircle },
  ];

  useEffect(() => {
    if (banner) {
      const timer = setTimeout(() => setBanner(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [banner]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 uppercase">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your business settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setBanner(null); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-50 text-purple-700'
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

        <div className="flex-1">
          {banner && (
            <div className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
              banner.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {banner.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {banner.message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-8">
            {activeTab === 'business' && (
              <BusinessTab
                vendorData={vendorData}
                updateVendor={updateVendor}
                setBanner={setBanner}
              />
            )}

            {activeTab === 'profile' && (
              <VendorProfileTab userData={userData} vendorData={vendorData} updateVendor={updateVendor} setBanner={setBanner} />
            )}

            {activeTab === 'payment' && (
              <PaymentTab vendorData={vendorData} updateVendor={updateVendor} setBanner={setBanner} />
            )}

            {activeTab === 'notifications' && (
              <NotificationsTab vendorData={vendorData} updateVendor={updateVendor} setBanner={setBanner} />
            )}

            {activeTab === 'security' && (
              <SecurityTab setBanner={setBanner} />
            )}

            {activeTab === 'help' && (
              <HelpTab />
            )}
          </div>

          {activeTab === 'business' && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-900 mb-3">Account Verification</h3>
              <p className="text-yellow-800 mb-4">Complete your business verification to access all features</p>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-white border border-yellow-300 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">Documents Required</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Business Registration Certificate</li>
                    <li>GSTIN Certificate</li>
                    <li>Bank Account Details</li>
                  </ul>
                </div>
                <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium">Start Verification</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BusinessTab({ vendorData, updateVendor, setBanner }: {
  vendorData: ReturnType<typeof useAuth>['vendorData'];
  updateVendor: (data: Record<string, unknown>) => Promise<void>;
  setBanner: (b: { type: 'success' | 'error'; message: string } | null) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    businessName: vendorData?.businessName ?? '',
    contactPerson: vendorData?.contactPerson ?? '',
    email: vendorData?.email ?? '',
    phone: vendorData?.phone ?? '',
    businessType: vendorData?.businessType ?? '',
    registrationNumber: vendorData?.registrationNumber ?? '',
    gstNumber: vendorData?.gstNumber ?? '',
    businessAddress: vendorData?.businessAddress ?? '',
    description: vendorData?.description ?? '',
  });

  useEffect(() => {
    setForm({
      businessName: vendorData?.businessName ?? '',
      contactPerson: vendorData?.contactPerson ?? '',
      email: vendorData?.email ?? '',
      phone: vendorData?.phone ?? '',
      businessType: vendorData?.businessType ?? '',
      registrationNumber: vendorData?.registrationNumber ?? '',
      gstNumber: vendorData?.gstNumber ?? '',
      businessAddress: vendorData?.businessAddress ?? '',
      description: vendorData?.description ?? '',
    });
  }, [vendorData]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setBanner(null);
    try {
      await updateVendor({
        business_name: form.businessName.trim() || undefined,
        contact_person: form.contactPerson.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        business_type: form.businessType || undefined,
        registration_number: form.registrationNumber.trim() || undefined,
        gst_number: form.gstNumber.trim() || undefined,
        business_address: form.businessAddress.trim() || undefined,
        description: form.description.trim() || undefined,
      });
      setBanner({ type: 'success', message: 'Business information updated successfully.' });
    } catch {
      setBanner({ type: 'error', message: 'Failed to update business details.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Business Information</h2>
      <div className="space-y-6 max-w-2xl">
        {[
          { key: 'businessName', label: 'Business Name', placeholder: 'e.g. Adventure Tours India' },
          { key: 'contactPerson', label: 'Contact Person', placeholder: 'e.g. Rajesh Kumar' },
          { key: 'email', label: 'Business Email', placeholder: 'business@example.com', type: 'email' },
          { key: 'phone', label: 'Phone', placeholder: '+91 9876543210', type: 'tel' },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
            <input
              type={field.type ?? 'text'}
              value={form[field.key as keyof typeof form]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
          <select
            value={form.businessType}
            onChange={(e) => handleChange('businessType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="">Select type</option>
            <option value="tour-operator">Tour Operator</option>
            <option value="activity-provider">Activity Provider</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
          <input type="text" value={form.registrationNumber} onChange={(e) => handleChange('registrationNumber', e.target.value)} placeholder="e.g. U12345MH2020PTC123456" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
          <input type="text" value={form.gstNumber} onChange={(e) => handleChange('gstNumber', e.target.value)} placeholder="e.g. 27AAPFU0939F1ZV" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
          <input type="text" value={form.businessAddress} onChange={(e) => handleChange('businessAddress', e.target.value)} placeholder="Full business address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Tell travelers about your business..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={() => setForm({ businessName: vendorData?.businessName ?? '', contactPerson: vendorData?.contactPerson ?? '', email: vendorData?.email ?? '', phone: vendorData?.phone ?? '', businessType: vendorData?.businessType ?? '', registrationNumber: vendorData?.registrationNumber ?? '', gstNumber: vendorData?.gstNumber ?? '', businessAddress: vendorData?.businessAddress ?? '', description: vendorData?.description ?? '' })} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function VendorProfileTab({ userData, vendorData, updateVendor, setBanner }: {
  userData: ReturnType<typeof useAuth>['userData'];
  vendorData: ReturnType<typeof useAuth>['vendorData'];
  updateVendor: (data: Record<string, unknown>) => Promise<void>;
  setBanner: (b: { type: 'success' | 'error'; message: string } | null) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState(vendorData?.description ?? '');

  useEffect(() => {
    setDescription(vendorData?.description ?? '');
  }, [vendorData]);

  const handleSave = async () => {
    setSaving(true);
    setBanner(null);
    try {
      await updateVendor({ description: description.trim() || undefined });
      setBanner({ type: 'success', message: 'Profile updated successfully.' });
    } catch {
      setBanner({ type: 'error', message: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Public Profile</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
              {vendorData?.logoUrl ? (
                <img src={vendorData.logoUrl} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <Building2 size={40} className="text-purple-600" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{vendorData?.businessName || userData?.name}</h3>
            <p className="text-gray-600">{vendorData?.email || userData?.email}</p>
            <p className="text-xs text-gray-400 mt-1">Business logo upload coming soon</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell travelers what makes your business special..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">This description is visible to travelers on your listing pages.</p>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={() => setDescription(vendorData?.description ?? '')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentTab({ vendorData, updateVendor, setBanner }: {
  vendorData: ReturnType<typeof useAuth>['vendorData'];
  updateVendor: (data: Record<string, unknown>) => Promise<void>;
  setBanner: (b: { type: 'success' | 'error'; message: string } | null) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [bankAccount, setBankAccount] = useState(vendorData?.bankAccount ?? '');
  const [upiId, setUpiId] = useState(vendorData?.upiId ?? '');

  useEffect(() => {
    setBankAccount(vendorData?.bankAccount ?? '');
    setUpiId(vendorData?.upiId ?? '');
  }, [vendorData]);

  const handleSave = async () => {
    setSaving(true);
    setBanner(null);
    try {
      await updateVendor({
        bank_account: bankAccount.trim() || undefined,
        upi_id: upiId.trim() || undefined,
      });
      setBanner({ type: 'success', message: 'Payment details updated.' });
    } catch {
      setBanner({ type: 'error', message: 'Failed to update payment details.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Payment & Payouts</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Wallet size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">How Payouts Work</h3>
              <p className="text-sm text-gray-600 mb-3">HolidayHub collects payments from travelers via Razorpay and transfers your share after each completed trip.</p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
                <p>Commission: 15% platform fee per booking</p>
                <p>Payout cycle: Weekly (every Monday)</p>
                <p>Settlement: Direct bank transfer or UPI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4">Payout Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account (for NEFT/RTGS)</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Account number + IFSC (e.g. 1234567890 — HDFC0001234)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID (for instant payouts)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. business@okhdfcbank"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="pt-2 flex items-center gap-4">
              <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : 'Save Payout Details'}
              </button>
              <button onClick={() => { setBankAccount(vendorData?.bankAccount ?? ''); setUpiId(vendorData?.upiId ?? ''); }} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4">Recent Payouts</h3>
          <p className="text-sm text-gray-500">No payouts yet. Payouts are processed weekly after trip completion.</p>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab({ vendorData, updateVendor, setBanner }: {
  vendorData: ReturnType<typeof useAuth>['vendorData'];
  updateVendor: (data: Record<string, unknown>) => Promise<void>;
  setBanner: (b: { type: 'success' | 'error'; message: string } | null) => void;
}) {
  const [prefs, setPrefs] = useState({
    email: true,
    sms: false,
    bookingAlerts: true,
    newBookings: true,
    payoutAlerts: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vendorData?.notificationPreferences) {
      setPrefs(vendorData.notificationPreferences as typeof prefs);
    }
  }, [vendorData]);

  const handleSave = async () => {
    setSaving(true);
    setBanner(null);
    try {
      await updateVendor({ notification_preferences: prefs });
      setBanner({ type: 'success', message: 'Notification preferences saved.' });
    } catch {
      setBanner({ type: 'error', message: 'Failed to save preferences.' });
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-purple-600' : 'bg-gray-300'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  const items = [
    { key: 'email' as const, label: 'Email Notifications', desc: 'Receive booking and account updates via email' },
    { key: 'sms' as const, label: 'SMS Alerts', desc: 'Get critical alerts via SMS' },
    { key: 'bookingAlerts' as const, label: 'Booking Alerts', desc: 'Get notified when a booking status changes' },
    { key: 'newBookings' as const, label: 'New Booking Alerts', desc: 'Instant notification when someone books your trip' },
    { key: 'payoutAlerts' as const, label: 'Payout Alerts', desc: 'Get notified when a payout is processed' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Notification Preferences</h2>
      <div className="space-y-6 max-w-2xl">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
            <Toggle value={prefs[item.key]} onChange={() => setPrefs({ ...prefs, [item.key]: !prefs[item.key] })} />
          </div>
        ))}
        <div className="pt-4">
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SecurityTab({ setBanner }: {
  setBanner: (b: { type: 'success' | 'error'; message: string } | null) => void;
}) {
  const supabase = getBrowserClient();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);

  const handleChangePassword = async () => {
    setBanner(null);
    if (!currentPassword || !newPassword) {
      setBanner({ type: 'error', message: 'Please fill in all password fields.' });
      return;
    }
    if (newPassword.length < 6) {
      setBanner({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setBanner({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setChanging(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChanging(false);
    if (error) {
      setBanner({ type: 'error', message: error.message || 'Failed to change password.' });
    } else {
      setBanner({ type: 'success', message: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Security Settings</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
            </div>
            <button onClick={handleChangePassword} disabled={changing} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 transition-colors">
              {changing ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
          <p className="text-gray-600 mb-4">Add an extra layer of security to your vendor account</p>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
            Enable 2FA
          </button>
          <p className="text-xs text-gray-400 mt-2">Coming soon — 2FA setup will be available here</p>
        </div>
      </div>
    </div>
  );
}

function HelpTab() {
  const faqs = [
    { q: 'How do I get paid?', a: 'HolidayHub collects payments from travelers and processes payouts weekly (every Monday) to your registered bank account or UPI ID.' },
    { q: 'What commission does HolidayHub charge?', a: 'We charge a 15% platform fee per booking. This covers payment processing, marketing, and customer support.' },
    { q: 'How do I update my listings?', a: 'Go to Vendor Dashboard > Listings to edit, create, or manage your trip listings. Changes to published listings go live immediately.' },
    { q: 'Can I manage bookings manually?', a: 'Yes, from Vendor Dashboard > Bookings you can view all bookings, confirm/cancel them, and see the full traveler manifest.' },
    { q: 'What happens if a traveler cancels?', a: 'Cancellation policies are set per listing. The platform processes refunds via Razorpay and adjusts your payout accordingly.' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Help & Support</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageSquare size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Vendor Support</h3>
              <p className="text-sm text-gray-600 mb-3">Questions about your account, payouts, or listings? Reach out to our vendor support team.</p>
              <a href="mailto:vendors@holidayhub.in" className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors">
                vendors@holidayhub.in <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-lg">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none">
                  <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                  <ChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
