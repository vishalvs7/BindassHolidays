'use client';

import { useEffect, useState, useMemo } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle, Users as UsersIcon, Mail, Calendar, Search } from 'lucide-react';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const supabase = getBrowserClient();
        const { data, error: e } = await supabase
          .from('profiles')
          .select('id, name, email, role, phone, created_at')
          .order('created_at', { ascending: false });
        if (e) throw e;
        setUsers((data ?? []).map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          role: r.role,
          phone: r.phone ?? null,
          created_at: r.created_at,
        })));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading users…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-4 w-4" /> {error}
      </div>
    );
  }

  const roleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'vendor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-gray-500">{filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Mail size={14} /> {u.email}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColor(u.role)}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{u.phone ?? '—'}</td>
                <td className="px-5 py-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <UsersIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{search ? 'No users match your search' : 'No users yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
