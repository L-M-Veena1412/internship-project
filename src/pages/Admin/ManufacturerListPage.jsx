import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ManufacturerTable from './ManufacturerTable';

const ManufacturerListPage = () => {
  const navigate = useNavigate();
  const [data] = useState([
    { id: 1, name: 'Coop Friberg', email: 'cfribergj@bloomberg.com', phone: '+91 2273927096', orders: 31, revenue: '2,087.64', joinedDate: '08/07/2023', status: 'Block', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Kerk Biaggi', email: 'kbiaggik@springer.com', phone: '+91 2631748654', orders: 32, revenue: '5,888.58', joinedDate: '01/10/2023', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=2' },
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header with Functional Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">Manufacturers</h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">Managing factory partners</p>
        </div>
        <button 
          onClick={() => navigate('/admin/manufacturers/add')}
          className="px-6 py-3 bg-emerald-600 text-white text-[11px] font-black uppercase rounded-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/>
          </svg>
          Add a new manufacturer
        </button>
      </div>

      <ManufacturerTable manufacturers={data} />
    </motion.div>
  );
};

export default ManufacturerListPage;