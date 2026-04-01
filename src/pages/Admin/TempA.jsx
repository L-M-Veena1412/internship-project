import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsPage = () => {
  const metrics = [
    { label: 'Total Revenue', value: '₹8,54,200', change: '+12.5%', icon: '💰' },
    { label: 'Avg. Order Value', value: '₹1,240', change: '+3.2%', icon: '📈' },
    { label: 'Conversion Rate', value: '4.8%', change: '-0.4%', icon: '🎯' },
    { label: 'Active Users', value: '1,284', change: '+18.2%', icon: '👥' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Sales Analytics</h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">Real-time store performance data</p>
        </div>
        <div className="flex gap-3">
           <select className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500 outline-none">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
           </select>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <span className="text-2xl">{m.icon}</span>
               <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${m.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {m.change}
               </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
            <h3 className="text-2xl font-black text-slate-800">{m.value}</h3>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/50 text-center min-h-[400px] flex flex-col items-center justify-center">
         <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner animate-pulse">📊</div>
         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Visual Data Engine</h4>
         <p className="text-xs font-bold text-slate-400 max-w-xs mx-auto leading-relaxed">
            We are currently connecting your store's API to the visual chart engine. Deep insights will appear here shortly.
         </p>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;