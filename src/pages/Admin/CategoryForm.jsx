import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { mockCategories } from '../../data/mockData';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // FORM STATE
  const [formData, setFormData] = useState({
    name: '',
    image: '📦',
    description: '',
    status: 'Active',
    isParent: true, // Default to Level 1
    selectedL1: '', // Parent of L2
    selectedL2: ''  // Parent of L3
  });

  // Derived state: Get subcategories of selected L1
  const availableL2 = mockCategories.find(c => c.id.toString() === formData.selectedL1)?.subcategories || [];

  useEffect(() => {
    if (isEditMode) {
      const category = mockCategories.find(c => c.id.toString() === id);
      if (category) {
        setFormData(prev => ({
          ...prev,
          name: category.name,
          description: `Management for ${category.name} department.`,
        }));
      }
    }
  }, [isEditMode, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Category Data:", formData);
    navigate('/admin/categories');
  };

  const inputClass = "w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#708A28] outline-none transition-all text-sm font-bold text-slate-700";
  const labelClass = "text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8 px-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            {isEditMode ? 'Modify Category' : 'Create Category'}
          </h2>
          <p className="text-[10px] font-black text-[#708A28] uppercase tracking-widest mt-1">Classification Management</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">
          ✕ Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-50 space-y-8">
        <div className="space-y-6">
          
          {/* 1. Category Name */}
          <div>
            <label className={labelClass}>Category Name</label>
            <input 
              type="text" 
              className={inputClass} 
              placeholder="e.g. Traditional Sweets" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          {/* 2. Hierarchy Logic (Radio Buttons) */}
          <div className="bg-slate-50/50 p-6 rounded-3xl border-2 border-slate-100">
            <label className={labelClass}>Category Placement</label>
            <div className="flex gap-8 mt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  checked={formData.isParent} 
                  onChange={() => setFormData({...formData, isParent: true})}
                  className="w-5 h-5 accent-[#708A28]"
                />
                <span className={`text-sm font-bold ${formData.isParent ? 'text-[#708A28]' : 'text-slate-500'}`}>Main Category (L1)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  checked={!formData.isParent} 
                  onChange={() => setFormData({...formData, isParent: false})}
                  className="w-5 h-5 accent-[#708A28]"
                />
                <span className={`text-sm font-bold ${!formData.isParent ? 'text-[#708A28]' : 'text-slate-500'}`}>Sub-Category (L2/L3)</span>
              </label>
            </div>
          </div>

          {/* 3. Conditional Dropdowns for Nesting */}
          <AnimatePresence>
            {!formData.isParent && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden pt-2"
              >
                {/* Select L1 Parent */}
                <div>
                  <label className={labelClass}>Select Parent (L1)</label>
                  <select 
                    className={inputClass}
                    value={formData.selectedL1}
                    onChange={(e) => setFormData({...formData, selectedL1: e.target.value, selectedL2: ''})}
                    required={!formData.isParent}
                  >
                    <option value="">Choose Main Group...</option>
                    {mockCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Select L2 Parent (Optional - if adding L3) */}
                {formData.selectedL1 && availableL2.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label className={labelClass}>Select Nested Group (L2) - Optional</label>
                    <select 
                      className={`${inputClass} border-l-4 border-l-[#708A28]`}
                      value={formData.selectedL2}
                      onChange={(e) => setFormData({...formData, selectedL2: e.target.value})}
                    >
                      <option value="">None (Make this a Level 2 Category)</option>
                      {availableL2.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Visual Emoji</label>
              <input type="text" className={inputClass} value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>Store Visibility</label>
              <select className={inputClass} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full py-5 bg-[#708A28] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:bg-olive-green-dark transition-all">
          {isEditMode ? 'Update Hierarchy' : 'Confirm & Save'}
        </button>
      </form>
    </motion.div>
  );
};

export default CategoryForm;