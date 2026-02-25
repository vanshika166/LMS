import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiPackage,
  FiTrendingUp
} from 'react-icons/fi';

const PaymentsPage = () => {
  const mode = useSelector((state) => state.app.mode); // true = dark
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Theme classes — CertificatesPage jaisa exact feel
  const containerBg = mode ? "bg-black text-white" : "bg-[#f7fafc] text-gray-900";
  const cardBg = mode ? "bg-white/5 border-white/10" : "bg-white border-gray-200";
  const subtleBg = mode ? "bg-white/10" : "bg-gray-100";
  const textMuted = mode ? "text-gray-400" : "text-gray-600";
  const headingColor = mode ? "text-white" : "text-gray-900";
  const borderColor = mode ? "border-white/10" : "border-gray-200";

  // Dummy data
  const transactions = [
    {
      id: 'LNZ98765',
      date: '02 Dec 2025',
      title: 'Robotics & Automation Course Pack',
      type: 'Course',
      method: 'UPI',
      amount: 2999,
      status: 'paid',
    },
    {
      id: 'LNZ87654',
      date: '15 Nov 2025',
      title: 'Pro Yearly Plan',
      type: 'Subscription',
      method: 'Credit Card',
      amount: 4999,
      status: 'paid',
    },
    {
      id: 'LNZ54321',
      date: '10 Oct 2025',
      title: 'Digital Marketing Mastery',
      type: 'Course',
      method: 'Wallet',
      amount: 1999,
      status: 'paid',
    },
    {
      id: 'LNZ22211',
      date: '05 Sep 2025',
      title: 'Python Full Course',
      type: 'Course',
      method: 'UPI',
      amount: 1499,
      status: 'refunded',
    },
  ];

  const filtered = transactions.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.includes(searchTerm)
  );

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className={`h-screen overflow-auto ${containerBg} transition-all duration-500`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className={`text-3xl md:text-4xl font-bold ${headingColor}`}>
          Payments & Transactions
        </h1>
        <p className={`mt-4 text-xl ${textMuted}`}>
          Keep track of your payments and transactions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Total Spent */}
          <div className={`rounded-2xl p-6 border ${cardBg} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textMuted}`}>Total Spent</p>
                <p className={`text-3xl font-bold mt-2 ${headingColor}`}>₹{totalSpent.toLocaleString()}</p>
              </div>
              <FiTrendingUp className="h-10 w-10 text-purple-400" />
            </div>
          </div>

          {/* Active Plan */}
          <div className={`rounded-2xl p-6 border ${cardBg} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textMuted}`}>Active Plan</p>
                <p className={`text-xl font-bold mt-2 ${headingColor}`}>Pro Yearly</p>
                <p className={`text-xs mt-1 ${textMuted}`}>Renews 15 Mar 2026</p>
              </div>
              <FiCheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </div>

          {/* Courses Purchased */}
          <div className={`rounded-2xl p-6 border ${cardBg} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textMuted}`}>Courses Purchased</p>
                <p className={`text-3xl font-bold mt-2 ${headingColor}`}>18</p>
              </div>
              <FiPackage className="h-10 w-10 text-blue-400" />
            </div>
          </div>

          {/* Wallet Balance */}
          <div className={`rounded-2xl p-6 border ${cardBg} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textMuted}`}>Wallet Balance</p>
                <p className={`text-3xl font-bold mt-2 ${headingColor}`}>₹350</p>
              </div>
              <FiDollarSign className="h-10 w-10 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pb-20">
        <h2 className={`text-3xl font-bold mb-8 ${headingColor}`}>All Transactions</h2>

        {filtered.length > 0 ? (
          <div className="grid gap-6">
            {filtered.map((txn) => (
              <div
                key={txn.id}
                className={`group rounded-2xl overflow-hidden border ${cardBg} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
              >
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className={`text-3xl ${txn.status === 'paid' ? 'text-green-400' : 'text-red-400'}`}>
                      {txn.status === 'paid' ? <FiCheckCircle /> : <FiXCircle />}
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${headingColor}`}>{txn.title}</h3>
                      <p className={`text-sm ${textMuted}`}>
                        Order ID: <span className="text-purple-400">#{txn.id}</span> • {txn.date}
                      </p>
                      <p className={`text-sm mt-1 ${textMuted}`}>
                        Paid via {txn.method === 'Credit Card' ? 'Card' : txn.method}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-3xl font-bold ${headingColor}`}>₹{txn.amount}</p>
                    <p className={`text-sm font-medium ${txn.status === 'paid' ? 'text-green-400' : 'text-red-400'}`}>
                      {txn.status === 'paid' ? 'Paid' : 'Refunded'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <FiCreditCard className={`mx-auto h-32 w-32 ${textMuted} mb-8 opacity-50`} />
            <h3 className={`text-3xl font-bold ${textMuted}`}>
              No transactions yet
            </h3>
            <p className={`mt-4 text-lg ${textMuted}`}>
              Your payment history will appear here once you make a purchase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;