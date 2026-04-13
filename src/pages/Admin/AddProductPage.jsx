import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

const CATEGORY_DATA = {
  "Snacks & Traditional Sweets": {
    "Traditional Sweets": ["Mysore Pak", "Laddu", "Halwa", "Kaju Katli"],
    "Savory Snacks": ["Murukku", "Mixture", "Kharas", "Nippattu"],
    "Organic Sweets": ["Jaggery Sweets", "Dry Fruit Balls"]
  },
  "Pantry & Grocery Essentials": {
    "Flours": ["Rice Flour", "Ragi Flour", "Wheat Flour", "Gram Flour"],
    "Spices": ["Chilly Powder", "Turmeric", "Garam Masala", "Sambar Powder"],
    "Oils": ["Cold Pressed Coconut Oil", "Groundnut Oil", "Ghee"]
  },
  "Health & Wellness": {
    "Millet Products": ["Millet Mix", "Millet Noodles"],
    "Dry Fruits": ["Almonds", "Cashews", "Walnuts"]
  }
};

const AddProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);

  const [selectedMain, setSelectedMain] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [selectedSpecific, setSelectedSpecific] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    product_tagline: '',
    product_overview: '',
    product_description: '',
    is_active: 1
  });

  useEffect(() => {
    if (isEditMode && productId === '1') {
      setFormData({
        name: 'Traditional Pure Ghee Mysore Pak',
        product_tagline: 'Authentic taste of South India',
        product_overview: 'Made with pure desi ghee and premium gram flour.',
        product_description: 'Our Mysore Pak follows a 50-year-old recipe...',
        is_active: 1
      });
      setSelectedMain('Snacks & Traditional Sweets');
    }
  }, [isEditMode, productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save Product Identity Logic
    navigate('/admin/products');
  };

  const inputClass = "w-full px-4 md:px-5 py-3.5 md:py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-700 font-bold text-sm";
  const labelClass = "block text-[10px] md:text-[11px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto pb-24 px-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            {isEditMode ? 'Edit Identity' : 'New Product Identity'}
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">Product Master Data</p>
        </div>
        <button onClick={() => navigate(-1)} className="w-full md:w-auto px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-emerald-600 transition-all">
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Database Table Details */}
        <section className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Core Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Product Name (name)</label>
              <input name="name" type="text" className={inputClass} required value={formData.name} onChange={handleInputChange} placeholder="e.g. Ghee Mysore Pak" />
            </div>
            <div>
              <label className={labelClass}>Product Tagline (tagline)</label>
              <input name="product_tagline" type="text" className={inputClass} value={formData.product_tagline} onChange={handleInputChange} placeholder="e.g. The King of Sweets" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Category (category_id)</label>
              <select className={inputClass} value={selectedMain} onChange={(e) => { setSelectedMain(e.target.value); setSelectedSub(''); }} required>
                <option value="">Select Main</option>
                {Object.keys(CATEGORY_DATA).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Sub-Category</label>
              <select className={inputClass} value={selectedSub} disabled={!selectedMain} onChange={(e) => setSelectedSub(e.target.value)} required>
                <option value="">Select Sub</option>
                {selectedMain && Object.keys(CATEGORY_DATA[selectedMain]).map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status (is_active)</label>
              <select name="is_active" className={inputClass} value={formData.is_active} onChange={handleInputChange}>
                <option value={1}>ACTIVE</option>
                <option value={0}>INACTIVE</option>
              </select>
            </div>
          </div>
        </section>

        {/* 2. Content Section */}
        <section className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Product Copy
          </h3>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Product Overview (overview)</label>
              <textarea name="product_overview" rows="2" className={`${inputClass} resize-none`} value={formData.product_overview} onChange={handleInputChange} placeholder="Brief summary..."></textarea>
            </div>
            <div>
              <label className={labelClass}>Full Description (description)</label>
              <textarea name="product_description" rows="5" className={`${inputClass} resize-none`} value={formData.product_description} onChange={handleInputChange} placeholder="Detailed story and ingredients..."></textarea>
            </div>
          </div>
        </section>

        {/* Submit Action */}
        <div className="pt-4">
          <button type="submit" className="w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl hover:bg-emerald-700 transition-all">
            {isEditMode ? 'Update Identity' : 'Save Product Identity'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProductPage;