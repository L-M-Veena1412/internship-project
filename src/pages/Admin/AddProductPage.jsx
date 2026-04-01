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

  const [images, setImages] = useState([]);
  const [selectedMain, setSelectedMain] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [selectedSpecific, setSelectedSpecific] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    actualPrice: '',
    discount: '',
    quantity: '',
    stockStatus: 'in-stock',
    description: '',
    overview: '',
    authenticityLabel: 'Taste Guaranteed',
    logisticsLabel: 'Damage Covered',
    supportLabel: '24/7 Support',
    feature1: '100% Veg',
    feature2: 'Hand-crafted',
    feature3: 'Hygienic',
    feature4: 'Traditional'
  });

  // Simulated data load for Edit Mode
  useEffect(() => {
    if (isEditMode && productId === '1') {
      setFormData(prev => ({
        ...prev,
        name: 'Traditional Pure Ghee Mysore Pak',
        actualPrice: '20750',
        discount: '10',
        quantity: '15',
        stockStatus: 'in-stock',
      }));
      setSelectedMain('Snacks & Traditional Sweets');
    }
  }, [isEditMode, productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/products');
  };

  // UI Styles
  const inputClass = "w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-700 font-medium";
  const labelClass = "block text-[11px] font-black uppercase text-slate-500 mb-2 ml-1 tracking-widest";
  const darkInput = "w-full px-5 py-4 rounded-2xl bg-slate-800/50 border-2 border-slate-700/50 focus:border-emerald-500 outline-none transition-all font-bold text-lg";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto pb-20 px-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            {isEditMode ? 'Edit Product' : 'New Product'}
          </h2>
          <p className="text-slate-500 font-medium mt-1">Catalog Management System</p>
        </div>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:text-emerald-600 hover:shadow-lg transition-all">
          ← Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. General Information */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
          <h3 className="text-xs font-black uppercase text-emerald-600 tracking-[0.2em] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> General Information
          </h3>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Product Name</label>
              <input name="name" type="text" className={inputClass} required value={formData.name} onChange={handleInputChange} placeholder="Enter product title..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Main Category</label>
                <select className={inputClass} value={selectedMain} onChange={(e) => { setSelectedMain(e.target.value); setSelectedSub(''); setSelectedSpecific(''); }} required>
                  <option value="">Select Category</option>
                  {Object.keys(CATEGORY_DATA).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Sub-Category</label>
                <select className={inputClass} value={selectedSub} disabled={!selectedMain} onChange={(e) => { setSelectedSub(e.target.value); setSelectedSpecific(''); }} required>
                  <option value="">Select Sub</option>
                  {selectedMain && Object.keys(CATEGORY_DATA[selectedMain]).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Specific Type</label>
                <select className={inputClass} value={selectedSpecific} disabled={!selectedSub} onChange={(e) => setSelectedSpecific(e.target.value)} required>
                  <option value="">Select Type</option>
                  {selectedSub && CATEGORY_DATA[selectedMain][selectedSub].map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Pricing & Commercials (MOVED HERE) */}
        <section className="bg-slate-950 p-10 rounded-[2.5rem] shadow-2xl text-white">
          <h3 className="text-xs font-black uppercase text-emerald-400 tracking-[0.2em] mb-8 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Commercials & Inventory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Price (₹)</label>
              <input name="actualPrice" type="number" className={`${darkInput} text-emerald-400`} required value={formData.actualPrice} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Discount (%)</label>
              <input name="discount" type="number" className={`${darkInput} text-orange-400`} value={formData.discount} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Quantity/Stock</label>
              <input name="quantity" type="number" className={`${darkInput} text-blue-400`} required value={formData.quantity} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Stock Status</label>
              <select name="stockStatus" className="w-full px-5 py-4 h-[64px] rounded-2xl bg-slate-800/50 border-2 border-slate-700/50 text-xs font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all" value={formData.stockStatus} onChange={handleInputChange}>
                <option value="in-stock">IN STOCK</option>
                <option value="out-of-stock">OUT OF STOCK</option>
              </select>
            </div>
          </div>
        </section>

        {/* 3. UX Highlights */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 space-y-8">
          <h3 className="text-xs font-black uppercase text-emerald-600 tracking-[0.2em] flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Storefront Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-100 pb-8">
            {['authenticityLabel', 'logisticsLabel', 'supportLabel'].map((key) => (
              <div key={key}>
                <label className={labelClass}>{key.replace('Label', ' Label')}</label>
                <input name={key} type="text" className={inputClass} value={formData[key]} onChange={handleInputChange} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['feature1', 'feature2', 'feature3', 'feature4'].map((key) => (
                <div key={key} className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">✓</span>
                  <input name={key} type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50/30 text-xs font-bold text-slate-600 focus:bg-white focus:border-emerald-500 outline-none transition-all" value={formData[key]} onChange={handleInputChange} />
                </div>
              ))}
          </div>
        </section>

        {/* 4. Marketing Descriptions */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 space-y-6">
          <h3 className="text-xs font-black uppercase text-emerald-600 tracking-[0.2em] flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Marketing Content
          </h3>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Product Overview (Short summary)</label>
              <textarea name="overview" rows="2" className={`${inputClass} resize-none`} value={formData.overview} onChange={handleInputChange}></textarea>
            </div>
            <div>
              <label className={labelClass}>Detailed Description</label>
              <textarea name="description" rows="5" className={`${inputClass} resize-none`} value={formData.description} onChange={handleInputChange}></textarea>
            </div>
          </div>
        </section>

        {/* 5. Image Gallery */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50">
          <h3 className="text-xs font-black uppercase text-emerald-600 tracking-[0.2em] mb-6 flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Product Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-emerald-50 shadow-md group">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity text-white font-black text-xs uppercase tracking-widest">Delete</button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-all group">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" /></svg>
                </div>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </section>

        {/* Submit */}
        <div className="pt-6">
          <button type="submit" className="w-full py-6 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl hover:bg-emerald-700 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
            {isEditMode ? 'Update Product Details' : 'Publish Product to catalog'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
          <p className="text-center text-slate-400 text-[10px] font-black uppercase mt-6 tracking-[0.2em]">Please review all fields before publishing.</p>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProductPage;