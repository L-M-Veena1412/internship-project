import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ManufacturerTable = ({ manufacturers, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="px-6 py-5">Manufacturer Info</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Phone</th>
              <th className="px-6 py-5 text-center">Orders</th>
              <th className="px-6 py-5 text-center">Total Revenue</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {manufacturers.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" alt="" />
                    <div>
                      {/* UPDATED: Now uses m.fullName and displays m.location */}
                      <p className="text-xs font-black text-slate-800 uppercase">{m.fullName}</p>
                      <p className="text-[9px] font-bold text-slate-400 truncate w-32">{m.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500">{m.email}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-700">{m.phone}</td>
                <td className="px-6 py-4 text-center text-xs font-black text-slate-800">{m.orders}</td>
                <td className="px-6 py-4 text-center text-xs font-black text-slate-900">₹{m.revenue}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                    m.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/admin/manufacturers/edit/${m.id}`)}
                      className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/manufacturers/detail/${m.id}`)}
                      className="p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManufacturerTable;