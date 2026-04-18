import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ManufacturerDetailView = () => {
  const navigate = useNavigate();

  // Mock data representing the updated schema
  const manufacturerData = {
    fullName: 'Alexander Blake',
    email: 'alexander@gmail.com',
    phone: '+91 3216546540',
    country: 'India',
    location: 'Bengaluru, Karnataka, India',
    zipCode: '560001',
    joinedDate: '15/08/2023',
  };

  const stats = [
    { label: 'Total Sales', value: '150', icon: '%', color: 'bg-cyan-400' },
    { label: 'Listed Products', value: '30', icon: '🛒', color: 'bg-emerald-400' },
    { label: 'Selling Rating', value: '30', icon: '⭐', color: 'bg-slate-600' },
  ];

  const orders = [
    { name: 'Allyson', no: '# 9668', transaction: 'Cash', status: 'Delivered', time: '4:45:26 PM' },
    { name: 'Annamaria', no: '# 6073', transaction: 'Cash', status: 'On The Way', time: '6:22:52 AM' },
    { name: 'Orton', no: '# 4079', transaction: 'Cash', status: 'On The Way', time: '9:30:03 PM' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-2xl font-black text-slate-800">Manufacturer Detail</h2>
        <div className="flex text-[11px] font-bold text-slate-400 gap-2 items-center">
          <span>Grocerly</span> <span>&gt;</span> <span>Admin</span> <span>&gt;</span> <span>Detail</span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left Sidebar Profile */}
        <div className="w-full xl:w-80 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <img src="https://i.pravatar.cc/150?u=a" className="w-16 h-16 rounded-full border-2 border-slate-50 shadow-sm" alt="" />
              <div>
                {/* UPDATED to use the new fullName */}
                <h3 className="font-bold text-slate-800">{manufacturerData.fullName}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{manufacturerData.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* UPDATED: Replaced irrelevant fields (Gender, Birthday) with Location, Country, Zip Code */}
              {[
                { l: 'Phone Number', v: manufacturerData.phone },
                { l: 'Location', v: manufacturerData.location },
                { l: 'Country', v: manufacturerData.country },
                { l: 'Zip Code', v: manufacturerData.zipCode },
                { l: 'Registered Since', v: manufacturerData.joinedDate },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">{item.l}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 space-y-8">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className={`w-14 h-14 ${s.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-slate-100`}>
                  {s.icon}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-black text-slate-800">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* All Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h3 className="text-lg font-bold text-slate-800">All Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm font-bold text-slate-400 border-b border-slate-50">
                    <th className="px-8 py-5">Name</th>
                    <th className="px-8 py-5">Order No</th>
                    <th className="px-8 py-5">Transaction</th>
                    <th className="px-8 py-5">Delivery Status</th>
                    <th className="px-8 py-5 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((o, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-5 text-sm font-semibold text-slate-600">{o.name}</td>
                      <td className="px-8 py-5 text-sm font-semibold text-slate-600">{o.no}</td>
                      <td className="px-8 py-5 text-sm font-semibold text-slate-600">{o.transaction}</td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase ${
                          o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-sm font-semibold text-slate-500">{o.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManufacturerDetailView;