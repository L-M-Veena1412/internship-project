import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
// Ensure mockCustomers is imported alongside mockOrders
import { mockOrders, mockCustomers } from '../../data/mockData';

const CustomerDetailView = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  // 1. DYNAMIC DATA LOOKUP
  // We find the customer in mockCustomers whose ID matches the URL parameter
  const customer = mockCustomers.find(c => c.id.toString() === customerId?.toString()) || mockCustomers[0];

  // 2. FILTER ORDERS FOR THIS SPECIFIC CUSTOMER
  // Only show orders where the 'customer' name matches the current profile name (updated for fullName)
  const customerOrders = Array.isArray(mockOrders) 
    ? mockOrders.filter(o => o.customer === (customer.fullName || customer.name))
    : [];

  // 3. DYNAMIC STATS calculation
  const stats = {
    total: customer.totalOrders || customerOrders.length,
    pending: customerOrders.filter(o => o.status?.toLowerCase() === 'pending').length || 0,
    cancelled: 0 // You can add logic for this if your mockData supports it
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto pb-20 space-y-6"
    >
      
      {/* Header */}
      <div className="flex justify-between items-center px-2 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Customer Profile</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Detailed database record for {customer.fullName || customer.name}
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/customers')} 
          className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-emerald-600 transition-all shadow-sm"
        >
          ← Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Profile & Key Info */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 1. Main Profile Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-6xl mb-6 shadow-inner">
               {customer.avatar || "🌱"}
            </div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Status: Active</p>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
              {customer.fullName || customer.name}
            </h1>
            <p className="text-xs font-bold text-slate-400 mb-6">ID: #{customer.id}</p>
            
            <div className="flex gap-2.5 w-full">
              <a 
                href={`tel:${customer.phone}`} 
                className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                 <span>📞</span> Call
              </a>
              <a 
                href={`mailto:${customer.email}`}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                 <span>✉️</span> Email
              </a>
            </div>
          </div>

          {/* 2. Order Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
             <StatMiniCard title="Total" value={stats.total} color="slate" />
             <StatMiniCard title="Pending" value={stats.pending} color="emerald" />
             <StatMiniCard title="Cancelled" value={stats.cancelled} color="red" />
          </div>

          {/* 3. Personal Information Card - UPDATED WITH LOCATION */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
             <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Personal Information</h3>
             <InfoRow label="Phone" value={customer.phone || "Not Provided"} />
             <InfoRow label="Email" value={customer.email || "Not Provided"} />
             <InfoRow label="Location" value={customer.location || "Not Provided"} />
             <InfoRow label="Country" value={customer.country || "Not Provided"} />
             <InfoRow label="Zip Code" value={customer.zipCode || "Not Provided"} />
             <InfoRow label="Joined" value={customer.joinedDate || customer.joined || "N/A"} />
          </div>
        </div>

        {/* RIGHT COLUMN: Orders Table */}
        <div className="lg:col-span-2 space-y-6 sticky top-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-fit">
            <div className="px-8 py-5 border-b border-slate-50">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Recent Orders</h3>
            </div>
            {customerOrders.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <th className="px-8 py-4">Order ID</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4 text-center">Amount</th>
                      <th className="px-8 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {customerOrders.map((order, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4">
                           <button 
                             onClick={() => navigate(`/admin/orders/${order.id}`)} 
                             className="text-sm font-bold text-slate-700 hover:text-emerald-600"
                           >
                             #{order.id}
                           </button>
                        </td>
                        <td className="px-8 py-4 text-xs font-bold text-slate-500">{order.date || 'Jan 15, 2024'}</td>
                        <td className="px-8 py-4 text-center font-black text-slate-900 text-sm">
                          ₹{order.amount?.toLocaleString() || '0'}
                        </td>
                        <td className="px-8 py-4 text-right">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              order.status?.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                              order.status?.toLowerCase() === 'shipped' ? 'bg-blue-50 text-blue-600' :
                              'bg-orange-50 text-orange-600'
                           }`}>
                              {order.status || 'Processing'}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            ) : (
                <div className="p-20 text-center">
                   <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">No orders found for this customer.</p>
                </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// Sub-component for small stat cards
const StatMiniCard = ({ title, value, color }) => {
  const colorMap = {
    slate: 'bg-white text-slate-900 border-slate-100',
    emerald: 'bg-white text-emerald-600 border-emerald-100',
    red: 'bg-white text-red-600 border-red-100',
  };
  return (
    <div className={`p-5 rounded-2xl border text-center shadow-sm ${colorMap[color] || colorMap.slate}`}>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{title}</p>
        <p className={`text-4xl font-black ${color === 'slate' ? 'text-slate-900' : ''}`}>{value}</p>
    </div>
  );
};

// Sub-component for an information row - UPDATED to handle long text gracefully
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">{label}</span>
    <span className="font-bold text-slate-700 text-right max-w-[60%] truncate" title={value}>{value}</span>
  </div>
);

export default CustomerDetailView;