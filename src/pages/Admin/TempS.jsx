import React from 'react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const sections = [
    { title: 'General Store Info', desc: 'Update your store name, logo, and contact info', icon: '🏪' },
    { title: 'Shipping & Delivery', desc: 'Manage shipping zones and flat rate costs', icon: '🚚' },
    { title: 'Payment Gateways', desc: 'Configure UPI, Stripe, and Razorpay', icon: '💳' },
    { title: 'Admin Security', desc: 'Password updates and multi-factor auth', icon: '🔐' },
  ];
const [isMaintenance, setIsMaintenance] = React.useState(false);

// Update your button:
<button 
  onClick={() => setIsMaintenance(!isMaintenance)}
  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
    isMaintenance ? 'bg-red-500 text-white' : 'bg-white text-slate-900 hover:bg-emerald-400'
  }`}
>
  {isMaintenance ? 'Deactivate' : 'Activate Now'}
</button>
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Portal Settings</h2>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">Master configuration panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((s, i) => (
          <button key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left group">
            <div className="w-14 h-14 bg-slate-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-colors shadow-inner">
               {s.icon}
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">{s.title}</h3>
            <p className="text-xs font-bold text-slate-400 leading-relaxed">{s.desc}</p>
          </button>
        ))}
      </div>

      {/* Footer Settings Card */}
      <div className="bg-slate-900 p-12 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
         <div className="relative z-10">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Maintenance Mode</h3>
            <p className="text-slate-400 text-xs font-medium max-w-sm mb-6">Instantly put your store into maintenance mode to perform updates.</p>
            <button className="px-8 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">
               Activate Now
            </button>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;