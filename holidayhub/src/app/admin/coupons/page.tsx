'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Tag, Trash2, ToggleLeft, ToggleRight, Copy } from 'lucide-react';
import type { Coupon } from '@/lib/coupon/types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    discountBearer: 'vendor' as 'vendor' | 'platform',
    minOrderAmount: '0',
    maxDiscount: '',
    usageLimit: '0',
    usageLimitPerUser: '1',
    expiresAt: '',
  });

  async function loadCoupons() {
    setLoading(true);
    try {
      const res = await fetch('/api/coupon/admin');
      const data = await res.json();
      if (data.ok) setCoupons(data.coupons);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCoupons(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/coupon/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          description: form.description,
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          discountBearer: form.discountBearer,
          minOrderAmount: Number(form.minOrderAmount),
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
          usageLimit: Number(form.usageLimit),
          usageLimitPerUser: Number(form.usageLimitPerUser),
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setShowForm(false);
        setForm({ code: '', description: '', discountType: 'percentage', discountValue: '', discountBearer: 'vendor', minOrderAmount: '0', maxDiscount: '', usageLimit: '0', usageLimitPerUser: '1', expiresAt: '' });
        await loadCoupons();
      } else {
        alert(data.error);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string) {
    await fetch('/api/coupon/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'toggle' }) });
    await loadCoupons();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this coupon?')) return;
    await fetch('/api/coupon/admin', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await loadCoupons();
  }

  function formatDate(d: string | null) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN');
  }

  const discountLabel = (c: Coupon) =>
    c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="mt-1 text-sm text-gray-500">Manage promo codes and discounts.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus size={16} /> {showForm ? 'Cancel' : 'New Coupon'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Code *</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="WEEKEND50" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="50% off on weekends" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Value *</label>
              <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder={form.discountType === 'percentage' ? '20' : '500'} required min="1" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Discount Bearer</label>
              <select value={form.discountBearer} onChange={(e) => setForm({ ...form, discountBearer: e.target.value as 'vendor' | 'platform' })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="vendor">Vendor bears cost</option>
                <option value="platform">Platform bears cost</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Min Order (₹)</label>
              <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="0" min="0" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Max Discount (₹) <span className="text-gray-400">(% only)</span></label>
              <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="No cap" min="0" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Usage Limit</label>
              <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="0 = unlimited" min="0" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Per User Limit</label>
              <input type="number" value={form.usageLimitPerUser} onChange={(e) => setForm({ ...form, usageLimitPerUser: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="1" min="0" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Expires At</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-4 rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">
            {saving ? 'Creating…' : 'Create Coupon'}
          </button>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading coupons…</div>
      ) : coupons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <Tag className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-4 text-lg font-semibold text-gray-900">No coupons yet</p>
          <p className="mt-1 text-sm text-gray-500">Create your first promo code.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-3 font-semibold text-gray-600">Code</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Discount</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Bearer</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Usage</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Expires</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 font-mono text-sm font-bold text-primary-700">
                      {c.code}
                      <button onClick={() => navigator.clipboard.writeText(c.code)} className="text-gray-400 hover:text-gray-600"><Copy size={14} /></button>
                    </span>
                    {c.description && <p className="mt-0.5 text-xs text-gray-400">{c.description}</p>}
                  </td>
                  <td className="px-5 py-4 font-medium">{discountLabel(c)}</td>
                  <td className="px-5 py-4 text-xs">
                    <span className={`rounded-full px-2 py-0.5 font-medium ${c.discountBearer === 'vendor' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {c.discountBearer}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {c.usedCount}/{c.usageLimit || '∞'}
                    {c.usageLimitPerUser > 0 && <span className="ml-1 text-xs text-gray-400">({c.usageLimitPerUser}/user)</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{formatDate(c.expiresAt)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggle(c.id)} className="text-gray-400 hover:text-primary-600" title="Toggle active">
                        {c.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-600" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
