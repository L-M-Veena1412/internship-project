import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { mockOrders } from '../../data/mockData';

const OrderDetailView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Find order from mock data
  const order = mockOrders.find(o => o.id.toString() === orderId) || mockOrders[0];

  const steps = ["Order received", "Processing", "On the way", "Delivered"];
  // Map your order status to a step number
  const getStepIndex = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 3;
    if (s === 'shipped' || s === 'on the way') return 2;
    if (s === 'processing') return 1;
    return 0; // Default to 'Order received'
  };

  const currentStep = getStepIndex(order.status);

  // Safety fallback for order items
  const orderItems = Array.isArray(order.items) ? order.items : [
    { 
      name: 'Traditional Mysore Pak', 
      price: 20750, 
      qty: 1, 
      image: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png' // Fallback icon
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto pb-20 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Order Detail: #{order.id}</h2>
        <button onClick={() => navigate('/admin/orders')} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Track Order */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-12 tracking-[0.2em]">Track Order</h3>
            <div className="relative flex justify-between items-center px-4">
              <div className="absolute top-[7px] left-0 w-full h-[3px] bg-slate-100 rounded-full"></div>
              <div 
                className="absolute top-[7px] left-0 h-[3px] bg-emerald-500 rounded-full transition-all duration-1000" 
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>

              {steps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col items-center z-10">
                  <div className={`w-4 h-4 rounded-full border-4 transition-all duration-500 ${
                    idx <= currentStep ? 'bg-white border-emerald-500 scale-125 shadow-lg shadow-emerald-200' : 'bg-white border-slate-200'
                  }`}></div>
                  <span className={`text-[9px] font-black uppercase mt-4 tracking-tighter text-center ${
                    idx <= currentStep ? 'text-emerald-600' : 'text-slate-400'
                  }`}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Products Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <th className="px-8 py-5">Products</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5 text-center">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orderItems.map((item, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex-shrink-0 shadow-sm">
                          {/* FIXED IMAGE SRC */}
                          <img 
                            src={item.image || 'https://via.placeholder.com/150'} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-900 text-sm">₹{item.price?.toLocaleString()}</td>
                    <td className="px-8 py-5 text-center font-black text-slate-400 text-sm">{item.qty}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3. Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Billing Address" content={order.customer} subContent="123 Organic Lane, Bengaluru, KA 560001" />
            <InfoCard title="Shipping Address" content={order.customer} subContent="123 Organic Lane, Bengaluru, KA 560001" />
            <InfoCard title="Total Payment" content="UPI / Credit Card" subContent="Transaction ID: #TXN9928374" />
            <InfoCard title="Logistics Details" content="BlueDart Express" subContent="AWB Tracking: 8829-1029-44" />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-6">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-8 tracking-[0.2em]">Order Summary</h3>
            
            {/* Sidebar Items List */}
            <div className="space-y-5 mb-8 pb-8 border-b border-slate-100">
               {orderItems.map((item, i) => (
                 <div key={i} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex-shrink-0">
                      {/* FIXED SIDEBAR IMAGE */}
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-slate-800 leading-tight mb-1">{item.qty}x {item.name}</p>
                      <p className="text-[11px] font-black text-emerald-600">₹{(item.price * item.qty)?.toLocaleString()}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
                <span>Sub Total</span>
                <span className="text-slate-800">₹{order.amount?.toLocaleString() || '20,750'}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
                <span>Delivery Fee</span>
                <span className="text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
                <span>Taxes (5%)</span>
                <span className="text-slate-800">₹1,037</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 pt-6 border-t border-slate-100 uppercase tracking-tighter mt-4">
                <span>Total</span>
                <span>₹21,787</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

const InfoCard = ({ title, content, subContent }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{title}</h4>
    <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">{content}</p>
    <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{subContent}</p>
  </div>
);

export default OrderDetailView;