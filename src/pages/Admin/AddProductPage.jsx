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
    wholesalePrice: '', // Added New Field
    discount: '',
    measurementType: 'Gram', // Added New Field
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

  useEffect(() => {
    if (isEditMode && productId === '1') {
      setFormData(prev => ({
        ...prev,
        name: 'Traditional Pure Ghee Mysore Pak',
        actualPrice: '20750',
        wholesalePrice: '18500',
        discount: '10',
        quantity: '15',
        stockStatus: 'in-stock',
        measurementType: 'Gram'
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

  // Responsive UI Styles
  const inputClass = "w-full px-4 md:px-5 py-3.5 md:py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-700 font-bold text-sm";
  const labelClass = "block text-[10px] md:text-[11px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest";
  const darkInput = "w-full px-5 py-4 rounded-2xl bg-slate-800/50 border-2 border-slate-700/50 focus:border-emerald-500 outline-none transition-all font-black text-xl";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto pb-24 px-4">
      
      {/* Responsive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            {isEditMode ? 'Edit Product' : 'New Product'}
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">Catalog Management System</p>
        </div>
        <button onClick={() => navigate(-1)} className="w-full md:w-auto px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-emerald-600 transition-all">
          ← Back to Inventory
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        
        {/* 1. Basic Details Section */}
        <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Basic Details
          </h3>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Product Title</label>
              <input name="name" type="text" className={inputClass} required value={formData.name} onChange={handleInputChange} placeholder="e.g. Organic Ragi Flour" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <label className={labelClass}>Category</label>
                <select className={inputClass} value={selectedMain} onChange={(e) => { setSelectedMain(e.target.value); setSelectedSub(''); setSelectedSpecific(''); }} required>
                  <option value="">Select Main</option>
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

        {/* 2. Updated Inventory & Pricing Section */}
        <section className="bg-slate-950 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl text-white">
          <h3 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] mb-8 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Inventory & Pricing
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {/* Retail Price */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-1 tracking-widest">Price (₹)</label>
              <input name="actualPrice" type="number" className={`${darkInput} text-emerald-400`} required value={formData.actualPrice} onChange={handleInputChange} placeholder="0.00" />
            </div>

            {/* Wholesale Price - NEW */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-1 tracking-widest">Wholesale Price (₹)</label>
              <input name="wholesalePrice" type="number" className={`${darkInput} text-yellow-400`} required value={formData.wholesalePrice} onChange={handleInputChange} placeholder="0.00" />
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-1 tracking-widest">Disc (%)</label>
              <input name="discount" type="number" className={`${darkInput} text-orange-400`} value={formData.discount} onChange={handleInputChange} placeholder="0" />
            </div>

            {/* Measurement Type - NEW */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-1 tracking-widest">Measurement Type</label>
              <select 
                name="measurementType" 
                className="w-full px-5 py-4 h-[64px] rounded-2xl bg-slate-800/50 border-2 border-slate-700/50 text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all text-white" 
                value={formData.measurementType} 
                onChange={handleInputChange}
              >
                <option value="Gram">Gram</option>
                <option value="Millilitre">Millilitre</option>
                <option value="Centimetres">Centimetres</option>
              </select>
            </div>

            {/* Stock Units */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-1 tracking-widest">Stock Units</label>
              <input name="quantity" type="number" className={`${darkInput} text-blue-400`} required value={formData.quantity} onChange={handleInputChange} placeholder="0" />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-1 tracking-widest">Visibility</label>
              <select name="stockStatus" className="w-full px-5 py-4 h-[64px] rounded-2xl bg-slate-800/50 border-2 border-slate-700/50 text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all" value={formData.stockStatus} onChange={handleInputChange}>
                <option value="in-stock">IN STOCK</option>
                <option value="out-of-stock">OUT OF STOCK</option>
              </select>
            </div>
          </div>
        </section>

        {/* 3. UX Highlights */}
        <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Storefront Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['authenticityLabel', 'logisticsLabel', 'supportLabel'].map((key) => (
              <div key={key}>
                <label className={labelClass}>{key.replace('Label', ' Badge')}</label>
                <input name={key} type="text" className={inputClass} value={formData[key]} onChange={handleInputChange} />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Descriptions */}
        <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Product Copy
          </h3>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Short Overview</label>
              <textarea name="overview" rows="2" className={`${inputClass} resize-none`} value={formData.overview} onChange={handleInputChange} placeholder="Brief summary for list views..."></textarea>
            </div>
            <div>
              <label className={labelClass}>Full Description</label>
              <textarea name="description" rows="5" className={`${inputClass} resize-none`} value={formData.description} onChange={handleInputChange} placeholder="Detailed product story, ingredients, and usage..."></textarea>
            </div>
          </div>
        </section>

        {/* 5. Image Gallery */}
        <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] mb-6">Media Gallery</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 bg-red-500/90 opacity-0 group-hover:opacity-100 transition-opacity text-white font-black text-[10px] uppercase">Remove</button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" /></svg>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </section>

        {/* Submit Action */}
        <div className="pt-8">
          <button type="submit" className="w-full py-5 md:py-6 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
            {isEditMode ? 'Update Product' : 'Publish to Catalog'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProductPage;