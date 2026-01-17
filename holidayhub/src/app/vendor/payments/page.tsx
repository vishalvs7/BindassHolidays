'use client';

import { CreditCard, TrendingUp, Download, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function VendorPaymentsPage() {
  const transactions = [
    { id: 1, date: '2024-06-15', description: 'Goa Package Booking', amount: '₹24,999', status: 'paid', type: 'booking' },
    { id: 2, date: '2024-06-10', description: 'Paragliding Activity', amount: '₹3,499', status: 'pending', type: 'activity' },
    { id: 3, date: '2024-06-05', description: 'Kerala Package', amount: '₹18,500', status: 'paid', type: 'booking' },
  ];

  return (
    <div>
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Payments</h1><p className="text-gray-600">Track your earnings and transactions</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex justify-between items-start">
              <div><h2 className="text-2xl font-bold mb-2">Total Earnings</h2><div className="text-5xl font-bold mb-4">₹2,48,456</div>
                <div className="flex items-center"><TrendingUp size={20} className="mr-2" /><span>+15% from last month</span></div></div>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center">
                <Download size={18} className="mr-2" />Withdraw
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50"><tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4"><div className="flex items-center"><Calendar size={14} className="mr-2" />{tx.date}</div></td>
                      <td className="px-6 py-4 font-medium text-gray-900">{tx.description}</td>
                      <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${tx.type === 'booking' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{tx.type}</span></td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{tx.amount}</td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tx.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {tx.status === 'paid' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}{tx.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between"><span className="text-gray-600">Available Balance</span><span className="font-semibold">₹1,85,456</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Pending Clearance</span><span className="font-semibold">₹63,000</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Last Payout</span><span className="font-semibold">₹45,000</span></div>
              <div className="pt-4 border-t"><div className="flex justify-between"><span className="font-semibold text-gray-900">Next Payout</span><span className="font-bold text-purple-600">₹85,456</span></div>
                <p className="text-sm text-gray-500 mt-2">Scheduled for June 30, 2024</p></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Withdrawal Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center"><CreditCard size={20} className="mr-3 text-gray-400" /><div><p className="font-medium">Bank Account</p><p className="text-sm text-gray-500">****1234</p></div></div>
                <button className="text-purple-600 text-sm font-medium">Edit</button>
              </div>
              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-300 hover:text-purple-600">
                + Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}