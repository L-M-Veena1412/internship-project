import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { mockCategories } from '../../data/mockData';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    image: '📦',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    if (isEditMode) {
      const category = mockCategories.find(c => c.id.toString() === id);
      if (category) {
        setFormData({
          name: category.name,
          image: '📦', // Default icon for edit
          description: `Management for ${category.name} department.`,
          status: 'Active'
        });
      }
    }
  }, [isEditMode, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd save to a database here
    navigate('/admin/categories');
  };

  const inputClass = "w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm font-bold text-slate-700";
  const labelClass = "text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8 px-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            {isEditMode ? 'Modify Category' : 'Create Category'}
          </h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Classification Management</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">
          ✕ Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-50 space-y-8">
        <div className="space-y-6">
          {/* Category Name */}
          <div>
            <label className={labelClass}>Category Name</label>
            <input 
              type="text" 
              className={inputClass} 
              placeholder="e.g. Fresh Leafy Greens" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          {/* Visual Icon / Emoji */}
          <div>
            <label className={labelClass}>Visual Identifier (Emoji)</label>
            <input 
              type="text" 
              className={`${inputClass} text-2xl text-center w-24`} 
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className={labelClass}>Operational Status</label>
            <select className={inputClass} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              <option value="Active">Active & Visible</option>
              <option value="Hidden">Hidden from Store</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Internal Note */}
          <div>
            <label className={labelClass}>Administrative Description</label>
            <textarea 
              rows="4" 
              className={`${inputClass} resize-none font-medium text-slate-500`} 
              placeholder="Describe the scope of this category..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </div>

        <button type="submit" className="w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98]">
          {isEditMode ? 'Update Category' : 'Save New Category'}
        </button>
      </form>
    </motion.div>
  );
};

export default CategoryForm;