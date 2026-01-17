'use client';

import { useState } from 'react';
import { Activity, Edit, Trash2, Eye, TrendingUp, MapPin, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function VendorActivitiesPage() {
  const [activities, setActivities] = useState([
    { id: 1, name: 'Paragliding Adventure', status: 'active', price: '₹3,499', bookings: 25, rating: 4.9, duration: '4 hours', location: 'Bir Billing', category: 'Adventure' },
    { id: 2, name: 'Scuba Diving', status: 'active', price: '₹4,999', bookings: 18, rating: 4.7, duration: '6 hours', location: 'Andaman', category: 'Water Sports' },
    { id: 3, name: 'Desert Safari', status: 'draft', price: '₹2,500', bookings: 0, rating: 0, duration: '5 hours', location: 'Rajasthan', category: 'Safari' },
  ]);

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div><h1 className="text-3xl font-bold text-gray-900">Activities</h1><p className="text-gray-600">Manage adventure activities</p></div>
        <Link href="/vendor/listings/activities/new" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2">
          <Activity size={20} /><span>Add New Activity</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[{title: 'Total Activities', value: activities.length, icon: Activity, color: 'bg-blue-100 text-blue-600'},
          {title: 'Active', value: activities.filter(a => a.status === 'active').length, icon: TrendingUp, color: 'bg-green-100 text-green-600'},
          {title: 'Total Bookings', value: 43, icon: Users, color: 'bg-purple-100 text-purple-600'},
          {title: 'Revenue', value: '₹1,47,456', icon: '₹', color: 'bg-yellow-100 text-yellow-600'}
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div><div className="text-2xl font-bold text-gray-900">{stat.value}</div><div className="text-sm text-gray-600">{stat.title}</div></div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.color}`}>
                {typeof stat.icon === 'string' ? <span className="font-bold">{stat.icon}</span> : <stat.icon size={24} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">All</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Active</button>
          </div>
          <input type="text" placeholder="Search activities..." className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
              {activities.map((act) => (
                <tr key={act.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><div className="font-medium text-gray-900">{act.name}</div>
                    <div className="flex items-center text-sm text-gray-500 mt-1"><MapPin size={14} className="mr-2" />{act.location}<span className="mx-2">•</span><Clock size={14} className="mr-2" />{act.duration}</div></td>
                  <td className="px-6 py-4"><span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${act.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{act.status}</span></td>
                  <td className="px-6 py-4"><div className="text-lg font-semibold text-gray-900">{act.price}</div><div className="text-sm text-gray-500">per person</div></td>
                  <td className="px-6 py-4"><div className="flex items-center"><Users size={16} className="mr-2 text-gray-400" /><span className="font-medium">{act.bookings}</span></div></td>
                  <td className="px-6 py-4"><div className="flex items-center"><div className="flex text-yellow-400">{'★'.repeat(Math.floor(act.rating))}{'☆'.repeat(5-Math.floor(act.rating))}</div><span className="ml-2 text-sm text-gray-600">{act.rating || '--'}</span></div></td>
                  <td className="px-6 py-4"><div className="flex space-x-2">
                    <Link href={`/vendor/listings/activities/edit/${act.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={16} /></Link>
                    <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><Eye size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}