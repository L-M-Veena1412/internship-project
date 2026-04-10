import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockCategories } from '../../data/mockData';

const CategoryListPage = () => {
  const navigate = useNavigate();

  const getCategoryIcon = (name) => {
    if (name.includes('Snacks')) return '🍪';
    if (name.includes('Health')) return '🌿';
    if (name.includes('Pickle')) return '🍯';
    if (name.includes('Pooja')) return '🪔';
    if (name.includes('Pantry')) return '🌾';
    if (name.includes('Coastal')) return '🐟';
    if (name.includes('Papads')) return '🍘';
    return '📦';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-2 md:p-6 space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Store Categories</h2>
          <p className="text-[10px] font-black text-[#708A28] uppercase tracking-[0.2em] mt-1">
            Managing {mockCategories.length} Main Departments
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/categories/add')}
          className="w-full md:w-auto px-6 py-3 bg-[#708A28] text-white text-[10px] font-black uppercase rounded-xl hover:bg-olive-green-dark transition-all shadow-lg flex items-center justify-center gap-2 tracking-widest"
        >
          <span>+</span> Add New Category
        </button>
      </div>

      <div className="hidden lg:block bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em]">
              <th className="px-8 py-5 font-black">Ref No.</th>
              <th className="px-8 py-5 font-black">Category & Nesting</th>
              <th className="px-8 py-5 font-black text-center">Products</th>
              <th className="px-8 py-5 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-olive-green/5 transition-colors group">
                <td className="px-8 py-5 text-xs font-black text-gray-400">
                  #{cat.id.toString().padStart(3, '0')}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100">
                      {getCategoryIcon(cat.name)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{cat.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cat.subcategories.slice(0, 3).map(sub => (
                          <span key={sub.id} className="text-[8px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase border border-slate-200">
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="inline-block px-3 py-1 bg-olive-green/10 text-[#708A28] text-[10px] font-black rounded-full uppercase">
                    {cat.count} Items
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/admin/categories/edit/${cat.id}`)}
                      className="p-2 text-slate-400 hover:text-[#708A28] hover:bg-olive-green/10 transition-all border border-slate-100 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-100 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CategoryListPage;