import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CustomerTable = ({ customers, onDelete }) => {
  const navigate = useNavigate();

  // Safety guard if customers data is missing or empty
  if (!customers || !Array.isArray(customers) || customers.length === 0) {
    return (
      <div className="p-20 text-center bg-white rounded-[2rem] border border-slate-100">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-sans">
          No Customers Found in Database
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Customer Info</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Contact Details</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Joined Date</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center">Orders</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {customers.map((user, index) => (
            <motion.tr 
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group hover:bg-slate-50/50 transition-all cursor-default"
            >
              {/* Profile Section */}
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
                    {user.avatar || "👤"}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-1">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: #{user.id || '50100'}</p>
                  </div>
                </div>
              </td>

              {/* Contact Section */}
              <td className="px-8 py-5">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-600">{user.email}</p>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{user.phone || '+91 00000 00000'}</p>
                </div>
              </td>

              {/* Date Joined */}
              <td className="px-8 py-5">
                <span className="text-xs font-black text-slate-400 uppercase">
                  {user.joinedDate || 'Jan 15, 2024'}
                </span>
              </td>

              {/* Order Count Badge */}
              <td className="px-8 py-5 text-center">
                <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black">
                  {user.totalOrders || '0'}
                </span>
              </td>

              {/* Actions */}
              <td className="px-8 py-5">
                <div className="flex justify-end gap-6">
                  {/* VIEW DETAIL */}
                  <button 
                    onClick={() => navigate(`/admin/customers/${user.id}`)}
                    className="text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-800 transition-colors tracking-widest"
                  >
                    View
                  </button>
                  
                  {/* EDIT CUSTOMER */}
                  <button 
                    onClick={() => navigate(`/admin/customers/edit/${user.id}`)}
                    className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors tracking-widest"
                  >
                    Edit
                  </button>

                  {/* DELETE CUSTOMER */}
                  <button 
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
                        onDelete(user.id);
                      }
                    }}
                    className="text-[10px] font-black uppercase text-red-400 hover:text-red-600 transition-colors tracking-widest"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;