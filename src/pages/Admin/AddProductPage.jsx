import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
    const finalProductData = { ...formData, category: selectedMain, subcategory: selectedSub, specificType: selectedSpecific, images };
    console.log("Saving New Product:", finalProductData);
    navigate('/admin/products');
  };

  // Reusable Tailwind Classes
  const inputClass = "w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400";
  const labelClass = "block text-[11px] font-black uppercase text-slate-500 mb-2 ml-1 tracking-wider";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-5xl mx-auto pb-20 px-4"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter leading-none">
            New Product
          </h2>
          <p className="text-slate-500 font-medium mt-2"></p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center w-fit px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50 transition-all"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* 1. General Info & Categories */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
          <h3 className="text-xs font-black uppercase text-emerald-600 tracking-[0.2em] mb-8 flex items-center">
            <span className="w-8 h-[1px] bg-emerald-200 mr-3"></span> General Information
          </h3>
          
          <div className="space-y-8">
            <div>
              <label className={labelClass}>Product Name</label>
              <input 
                name="name" type="text" className={inputClass} required 
                placeholder="e.g. Traditional Pure Ghee Mysore Pak"
                value={formData.name} onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Main Category</label>
                <div className="relative">
                  <select 
                    className={`${inputClass} appearance-none cursor-pointer`}
                    value={selectedMain}
                    onChange={(e) => { setSelectedMain(e.target.value); setSelectedSub(''); setSelectedSpecific(''); }}
                    required
                  >
                    <option value="">Select Category</option>
                    {Object.keys(CATEGORY_DATA).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Sub-Category</label>
                <select 
                  className={`${inputClass} appearance-none disabled:opacity-30`}
                  value={selectedSub} disabled={!selectedMain}
                  onChange={(e) => { setSelectedSub(e.target.value); setSelectedSpecific(''); }}
                  required
                >
                  <option value="">Select Sub</option>
                  {selectedMain && Object.keys(CATEGORY_DATA[selectedMain]).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Specific Type</label>
                <select 
                  className={`${inputClass} appearance-none disabled:opacity-30`}
                  value={selectedSpecific} disabled={!selectedSub}
                  onChange={(e) => setSelectedSpecific(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  {selectedSub && CATEGORY_DATA[selectedMain][selectedSub].map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Pricing & Inventory (Dark Contrast Section) */}
        <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 text-white grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-4 flex items-center justify-between border-b border-slate-800 pb-6">
             <h3 className="text-xs font-black uppercase text-emerald-400 tracking-[0.2em]">Commercials & Stock</h3>
             <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/20">LIVE DATA</span>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Price (₹)</label>
            <input name="actualPrice" type="number" className="w-full px-5 py-4 rounded-2xl bg-slate-800 border border-slate-700 focus:border-emerald-500 outline-none transition-all font-bold text-xl text-emerald-400" required value={formData.actualPrice} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Discount (%)</label>
            <input name="discount" type="number" className="w-full px-5 py-4 rounded-2xl bg-slate-800 border border-slate-700 focus:border-orange-500 outline-none transition-all font-bold text-xl text-orange-400" value={formData.discount} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Quantity</label>
            <input name="quantity" type="number" className="w-full px-5 py-4 rounded-2xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none transition-all font-bold text-xl" required value={formData.quantity} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Status</label>
            <select name="stockStatus" className="w-full px-5 py-4 h-[62px] rounded-2xl bg-slate-800 border border-slate-700 focus:border-emerald-500 outline-none transition-all font-bold text-sm" value={formData.stockStatus} onChange={handleInputChange}>
              <option value="in-stock">IN STOCK</option>
              <option value="out-of-stock">OUT OF STOCK</option>
            </select>
          </div>
        </section>

        {/* 3. User View Highlights */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 space-y-8">
          <h3 className="text-xs font-black uppercase text-emerald-600 tracking-[0.2em] mb-4 flex items-center">
            <span className="w-8 h-[1px] bg-emerald-200 mr-3"></span> Storefront Highlights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['authenticityLabel', 'logisticsLabel', 'supportLabel'].map((key) => (
              <div key={key}>
                <label className={labelClass}>{key.replace('Label', ' Label')}</label>
                <input 
                  name={key} type="text" className={inputClass} 
                  value={formData[key]} onChange={handleInputChange} 
                />
              </div>
            ))}
          </div>

          <div className="pt-4">
            <label className={labelClass}>Feature Checklist</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {['feature1', 'feature2', 'feature3', 'feature4'].map((key) => (
                <div key={key} className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">✓</span>
                  <input 
                    name={key} type="text" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-xs font-bold text-slate-600" 
                    value={formData[key]} onChange={handleInputChange} 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Descriptions */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 space-y-8">
          <h3 className="text-xs font-black uppercase text-emerald-600 tracking-[0.2em] mb-4 flex items-center">
            <span className="w-8 h-[1px] bg-emerald-200 mr-3"></span> Marketing Content
          </h3>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Product Overview (Short)</label>
              <textarea 
                name="overview" rows="2" className={`${inputClass} resize-none`}
                placeholder="A brief summary for the product header..."
                value={formData.overview} onChange={handleInputChange}
              ></textarea>
            </div>
            <div>
              <label className={labelClass}>Detailed Description</label>
              <textarea 
                name="description" rows="5" className={`${inputClass} resize-none`}
                placeholder="Detailed story, ingredients, and specifics..."
                value={formData.description} onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </section>

        {/* 5. Image Gallery */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100">
          <h3 className="text-xs font-black uppercase text-emerald-600 tracking-[0.2em] mb-8 flex items-center">
            <span className="w-8 h-[1px] bg-emerald-200 mr-3"></span> Product Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {images.map((img, index) => (
              <motion.div 
                key={index} layout 
                className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-emerald-50 group shadow-md"
              >
                <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" onClick={() => removeImage(index)} 
                  className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-black text-[10px] uppercase tracking-widest"
                >
                  Delete
                </button>
              </motion.div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[1.5rem] cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-all group">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 mt-3 tracking-tighter">Add Media</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-6">
          <button 
            type="submit" 
            className="w-full py-6 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-400 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
          >
            Publish Product
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProductPage;