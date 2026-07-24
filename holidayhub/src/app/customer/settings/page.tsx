'use client';

import { useState, useEffect } from 'react';
import { User, Bell, Lock, Shield, CreditCard, Globe, HelpCircle, CheckCircle, AlertCircle, Download, Trash2, Smartphone, Wallet, MessageSquare, ExternalLink, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { getBrowserClient } from '@/lib/supabase/client';

export default function CustomerSettingsPage() {
  const { userData, vendorData, updateProfile, updateVendor, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'preferences', name: 'Preferences', icon: Globe },
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

        {/* Main Content */}
        <div className="flex-1">
          {/* Success / Error Banner */}
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
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <ProfileTab
                userData={userData}
                saving={saving}
                setSaving={setSaving}
                setBanner={setBanner}
                updateProfile={updateProfile}
              />
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <NotificationsTab userId={userData?.uid} setBanner={setBanner} />
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <SecurityTab setBanner={setBanner} />
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <PrivacyTab userData={userData} setBanner={setBanner} />
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <PaymentTab userId={userData?.uid} setBanner={setBanner} />
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <PreferencesTab userId={userData?.uid} setBanner={setBanner} />
            )}

            {/* Help Tab */}
            {activeTab === 'help' && (
              <HelpTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ userData, saving, setSaving, setBanner, updateProfile }: {
  userData: ReturnType<typeof useAuth>['userData'];
  saving: boolean;
  setSaving: (v: boolean) => void;
  setBanner: (b: { type: 'success' | 'error'; message: string } | null) => void;
  updateProfile: (data: { name?: string; phone?: string }) => Promise<void>;
}) {
  const [name, setName] = useState(userData?.name ?? '');
  const [phone, setPhone] = useState(userData?.phone ?? '');

  useEffect(() => {
    setName(userData?.name ?? '');
    setPhone(userData?.phone ?? '');
  }, [userData]);

  const handleSave = async () => {
    setSaving(true);
    setBanner(null);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      setBanner({ type: 'success', message: 'Profile updated successfully.' });
    } catch {
      setBanner({ type: 'error', message: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Profile Information</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center">
            <User size={40} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{userData?.name}</h3>
            <p className="text-gray-600">{userData?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue={userData?.email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Customer'}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={() => { setName(userData?.name ?? ''); setPhone(userData?.phone ?? ''); }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab({ userId, setBanner }: {
  userId: string | undefined;
  setBanner: (b: { type: 'success' | 'error'; message: string } | null) => void;
}) {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    promotions: true,
    bookingUpdates: true,
    priceAlerts: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPreferences() {
      if (!userId) { setLoading(false); return; }
      const supabase = getBrowserClient();
      const { data } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', userId)
        .single();
      if (data?.notification_preferences) {
        setNotifications(data.notification_preferences);
      }
      setLoading(false);
    }
    loadPreferences();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setBanner(null);
    const supabase = getBrowserClient();
    const { error } = await supabase
      .from('profiles')
      .update({ notification_preferences: notifications })
      .eq('id', userId);
    setSaving(false);
    if (error) {
      setBanner({ type: 'error', message: 'Failed to save preferences.' });
    } else {
      setBanner({ type: 'success', message: 'Notification preferences saved.' });
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading preferences...</div>;
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-purple-600' : 'bg-gray-300'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        value ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  );

  const items = [
    { key: 'email' as const, label: 'Email Notifications', desc: 'Receive booking updates via email' },
    { key: 'sms' as const, label: 'SMS Alerts', desc: 'Get booking reminders via SMS' },
    { key: 'promotions' as const, label: 'Promotional Offers', desc: 'Receive deals and discounts' },
    { key: 'bookingUpdates' as const, label: 'Booking Updates', desc: 'Get updates about your bookings' },
    { key: 'priceAlerts' as const, label: 'Price Alerts', desc: 'Get notified when prices drop' },
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
            <Toggle
              value={notifications[item.key]}
              onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
            />
          </div>
        ))}
        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 transition-colors"
          >
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
  const [deleting, setDeleting] = useState(false);

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
      setBanner({ type: 'error', message: error.message || 'Failed to change password. You may need to re-login first.' });
    } else {
      setBanner({ type: 'success', message: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'This action is irreversible. All your data will be permanently deleted. Are you sure?'
    );
    if (!confirmed) return;
    setDeleting(true);
    setBanner(null);
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: (await supabase.auth.getSession()).data.session?.access_token }),
      });
      const json = await res.json();
      if (!res.ok) {
        setBanner({ type: 'error', message: json.error || 'Failed to delete account.' });
      } else {
        await supabase.auth.signOut();
        window.location.href = '/';
      }
    } catch {
      setBanner({ type: 'error', message: 'Failed to delete account. Please try again.' });
    } finally {
      setDeleting(false);
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
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={changing}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 transition-colors"
            >
              {changing ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
          <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
            Enable 2FA
          </button>
          <p className="text-xs text-gray-400 mt-2">Coming soon — 2FA setup will be available here</p>
        </div>

        <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
          <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
          <p className="text-red-700 mb-4">Once you delete your account, there is no going back. All your data will be permanently removed.</p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PrivacyTab({ userData, setBanner }: {
  userData: ReturnType<typeof useAuth>['userData'];
  setBanner: (b: { type: 'success' | 'error'; message: string } | null) => void;
}) {
  const supabase = getBrowserClient();
  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    if (!userData?.uid) return;
    setExporting(true);
    setBanner(null);
    try {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*, listings(title), booking_travelers(*)')
        .eq('user_id', userData.uid);

      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userData.uid);

      const exportData = {
        profile: { name: userData.name, email: userData.email, phone: userData.phone },
        bookings: bookings ?? [],
        reviews: reviews ?? [],
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `holidayhub-data-${userData.name?.replace(/\s+/g, '-').toLowerCase() ?? 'user'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setBanner({ type: 'success', message: 'Your data has been exported successfully.' });
    } catch {
      setBanner({ type: 'error', message: 'Failed to export data. Please try again.' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Privacy Settings</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Download size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Export Your Data</h3>
              <p className="text-sm text-gray-600 mb-4">Download a copy of all your data including bookings, reviews, and profile information.</p>
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm disabled:opacity-50 transition-colors"
              >
                {exporting ? 'Exporting...' : 'Export Data'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Shield size={20} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Profile Visibility</h3>
              <p className="text-sm text-gray-600 mb-3">Control who can see your profile information.</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                  <span className="text-sm text-gray-700">Show name on reviews</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                  <span className="text-sm text-gray-700">Allow vendors to contact me for trip updates</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Smartphone size={20} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Connected Devices</h3>
              <p className="text-sm text-gray-600 mb-3">Manage sessions on other devices.</p>
              <button className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
                Sign out of all devices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentTab({ userId, setBanner }: {
  userId: string | undefined;
  setBanner: (b: { type: 'success' | 'error'; message: string } | null) => void;
}) {
  const [bookings, setBookings] = useState<{ id: string; total_amount: number; status: string; created_at: string; listing_title?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!userId) { setLoading(false); return; }
      const supabase = getBrowserClient();
      const { data } = await supabase
        .from('bookings')
        .select('id, total_amount, status, created_at, listings(title)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) {
        setBookings(data.map((b: Record<string, unknown>) => ({
          id: b.id as string,
          total_amount: b.total_amount as number,
          status: b.status as string,
          created_at: b.created_at as string,
          listing_title: (b.listings as { title: string } | null)?.title,
        })));
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Payment & Billing</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Wallet size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Payment Method</h3>
              <p className="text-sm text-gray-600 mb-3">All payments are processed securely via Razorpay UPI.</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CreditCard size={16} />
                <span>No saved payment methods — you pay per booking via Razorpay checkout.</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-4">Recent Transactions</h3>
          {loading ? (
            <p className="text-sm text-gray-500">Loading transactions...</p>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions yet.</p>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Trip</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3 text-gray-900">{b.listing_title ?? 'Trip'}</td>
                      <td className="px-4 py-3 text-gray-900">₹{b.total_amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          b.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(b.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreferencesTab({ userId, setBanner }: {
  userId: string | undefined;
  setBanner: (b: { type: 'success' | 'error'; message: string } | null) => void;
}) {
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('system');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!userId) return;
      const supabase = getBrowserClient();
      const { data } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single();
      if (data?.preferences) {
        setCurrency(data.preferences.currency ?? 'INR');
        setLanguage(data.preferences.language ?? 'en');
        setTheme(data.preferences.theme ?? 'system');
      }
    }
    load();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setBanner(null);
    const supabase = getBrowserClient();
    const { error } = await supabase
      .from('profiles')
      .update({ preferences: { currency, language, theme } })
      .eq('id', userId);
    setSaving(false);
    if (error) {
      setBanner({ type: 'error', message: 'Failed to save preferences.' });
    } else {
      setBanner({ type: 'success', message: 'Preferences saved successfully.' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Preferences</h2>
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="INR">INR — Indian Rupee (₹)</option>
            <option value="USD">USD — US Dollar ($)</option>
            <option value="EUR">EUR — Euro (€)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <div className="flex gap-3">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm border transition-colors ${
                  theme === t
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}

function HelpTab() {
  const faqs = [
    {
      q: 'How do I book a trip?',
      a: 'Browse available trips on the Explore page, select your preferred departure date, and complete the 30-second checkout via UPI.',
    },
    {
      q: 'Can I cancel my booking?',
      a: 'Yes, you can cancel from your booking details page. Refunds are processed based on the cancellation policy.',
    },
    {
      q: 'What happens if I need to change dates?',
      a: 'Contact the trip operator directly via the details on your booking confirmation. Alternatively, cancel and rebook.',
    },
    {
      q: 'How do I get my trip details before departure?',
      a: 'You will receive an automated WhatsApp confirmation with your Ground Support Card (trip captain, operator contacts) 24 hours before departure.',
    },
    {
      q: 'Is my payment secure?',
      a: 'All payments are processed through Razorpay with bank-grade encryption. We never store your card or UPI details.',
    },
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
              <h3 className="font-medium text-gray-900 mb-1">Contact Support</h3>
              <p className="text-sm text-gray-600 mb-3">Need help? Reach out to our support team.</p>
              <a
                href="mailto:support@holidayhub.in"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors"
              >
                support@holidayhub.in <ExternalLink size={14} />
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

        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-1">Report an Issue</h3>
          <p className="text-sm text-gray-600 mb-3">Found a bug or have a suggestion? Let us know.</p>
          <a
            href="https://github.com/anomalyco/opencode/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            Report on GitHub <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
