import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductVariantForm = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    manufacturer_id: '',
    product_id: '',
    sku: '', 
    weight_value: '', 
    measurement_type: 'GRAM', 
    packaging_type: 'Box', 
    price: '',
    wholesale_price: '',
    discount: '',
    stock_units: '',
    visibility: 'IN STOCK'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImages].slice(0, 10));
  };

  // Helper function to prevent typing negative signs or 'e' in number fields
  const preventNegativeInput = (e) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault();
    }
  };

  const inputClass = "w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#708A28] outline-none transition-all text-slate-700 font-bold text-sm";
  const labelClass = "block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest";
  const darkInput = "w-full px-5 py-4 rounded-2xl bg-slate-800/50 border-2 border-slate-700/50 focus:border-[#708A28] outline-none transition-all font-black text-xl text-white";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto pb-24 px-4 font-sans">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">New Commercial Variant</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Manufacturer Inventory & Stock Mapping</p>
      </div>

      <form className="space-y-8">
        {/* LINKING SECTION - Manufacturer Dropdown is here */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Manufacturer Details</label>
              <select name="manufacturer_id" className={inputClass} onChange={handleInputChange}>
                <option value="">Select Manufacturer...</option>
                {/* Add your dynamic manufacturers here later */}
                <option value="1">Shree Krishna Sweets</option>
                <option value="2">Ankola Bakers</option>
                <option value="3">Mangaluru Spices</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Product Identity</label>
              <select name="product_id" className={inputClass} onChange={handleInputChange}>
                <option value="">Select Base Product...</option>
                <option value="101">Ghee Mysore Pak</option>
                <option value="102">Banana Halwa</option>
              </select>
            </div>
          </div>
        </section>

        {/* LOGISTICS SECTION */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-[10px] font-black uppercase text-[#708A28] tracking-[0.2em] flex items-center gap-3">
             Logistics & Packaging
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Weight/Volume Value</label>
              <input 
                name="weight_value" 
                type="number" 
                min="0"
                onKeyDown={preventNegativeInput}
                className={inputClass} 
                placeholder="e.g. 500" 
              />
            </div>
            <div>
              <label className={labelClass}>Measurement Unit</label>
              <select name="measurement_type" className={inputClass}>
                <option value="GRAM">GRAMS (gm)</option>
                <option value="KG">KILOGRAMS (kg)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Packaging</label>
              <select name="packaging_type" className={inputClass}>
                <option value="Box">Premium Box</option>
                <option value="Pouch">Eco Pouch</option>
                <option value="Tin">Tin Container</option>
              </select>
            </div>
          </div>
        </section>

        {/* PRICE SECTION (DARK) - Added Validation here */}
        <section className="bg-[#0B0E14] p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-white">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-1 tracking-widest">Sale Price (₹)</label>
              <input 
                name="price" 
                type="number" 
                min="0"
                onKeyDown={preventNegativeInput}
                className={`${darkInput} text-emerald-400`} 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-1 tracking-widest">Disc (%)</label>
              <input 
                name="discount" 
                type="number" 
                min="0"
                max="100"
                onKeyDown={preventNegativeInput}
                className={`${darkInput} text-orange-400`} 
                placeholder="0" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-1 tracking-widest">Stock Units</label>
              <input 
                name="stock_units" 
                type="number" 
                min="0"
                onKeyDown={preventNegativeInput}
                className={`${darkInput} text-blue-400`} 
                placeholder="0" 
              />
            </div>
          </div>
        </section>

        {/* MEDIA GALLERY */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black uppercase text-[#708A28] tracking-[0.2em] mb-6 flex items-center gap-3">
             Variant Media Gallery
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <label className="aspect-square flex items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer hover:bg-[#708A28]/5 transition-all">
              <span className="text-3xl text-slate-300">+</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </section>

        <button type="button" onClick={() => navigate('/admin/variants')} className="w-full py-5 bg-[#008A5E] text-white font-black uppercase tracking-widest rounded-full shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3">
          Publish Variant to Store
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={3} /></svg>
        </button>
      </form>
    </motion.div>
  );
};

export default ProductVariantForm;