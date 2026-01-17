'use client';

import { BarChart3, TrendingUp, Users, Eye, Share2, Calendar } from 'lucide-react';

export default function VendorAnalyticsPage() {
  const analytics = [
    { title: 'Total Views', value: '1,248', change: '+24%', icon: Eye, color: 'bg-blue-100 text-blue-600' },
    { title: 'Conversion Rate', value: '3.4%', change: '+1.2%', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { title: 'Avg. Rating', value: '4.7', change: '+0.3', icon: BarChart3, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Social Shares', value: '156', change: '+42%', icon: Share2, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div>
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Analytics</h1><p className="text-gray-600">Track your business performance</p></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {analytics.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div><div className="text-2xl font-bold text-gray-900">{stat.value}</div><div className="text-sm text-gray-600">{stat.title}</div>
                  <div className="flex items-center mt-2"><span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span><span className="text-sm text-gray-500 ml-2">from last month</span></div>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.color}`}><Icon size={24} /></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm"><option>Last 30 days</option><option>Last 90 days</option><option>This year</option></select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chart visualization will be added</p>
              <p className="text-sm text-gray-400">Integration with analytics service</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing</h3>
            <button className="text-purple-600 text-sm font-medium">View all</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Goa Beach Package', bookings: 12, revenue: '₹2.98L' },
              { name: 'Paragliding Adventure', bookings: 25, revenue: '₹87.5K' },
              { name: 'Kerala Backwaters', bookings: 8, revenue: '₹1.48L' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="font-bold text-purple-600">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.revenue}</p>
                  <p className="text-xs text-gray-500">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-3"><Users size={20} className="text-blue-600 mr-2" /><span className="font-medium text-blue-900">Customer Demographics</span></div>
            <p className="text-sm text-blue-800">Most bookings from 25-34 age group</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-3"><Calendar size={20} className="text-green-600 mr-2" /><span className="font-medium text-green-900">Peak Seasons</span></div>
            <p className="text-sm text-green-800">Weekends see 40% more bookings</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-3"><TrendingUp size={20} className="text-purple-600 mr-2" /><span className="font-medium text-purple-900">Optimization Tip</span></div>
            <p className="text-sm text-purple-800">Add more photos to increase conversions</p>
          </div>
        </div>
      </div>
    </div>
  );
}