import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../../data/mockData';
import { formatPriceINR } from '../../utils/currency';

const ProductDetailView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Find the product by ID or fallback to the first item
  const product = mockProducts.find(p => p.id.toString() === productId) || mockProducts[0];

  if (!product) {
    return (
      <div className="p-10 md:p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 mx-4">
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Product Not Found</p>
        <button onClick={() => navigate('/admin/products')} className="mt-4 text-emerald-600 font-bold underline">Return to Inventory</button>
      </div>
    );
  }

  const getStrikePrice = (price) => {
    if (!price) return 0;
    const numericPrice = Number(price.toString().replace(/,/g, ''));
    return (numericPrice + 500).toLocaleString();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto pb-24 px-4 space-y-6 md:space-y-8"
    >
      {/* --- RESPONSIVE HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-5 md:p-6 rounded-[2rem] md:rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">Live Preview</h2>
          <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Customer View Simulation</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <button 
                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all text-center"
            >
                Edit
            </button>
            <button 
                onClick={() => navigate('/admin/products')}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all text-center"
            >
                Back
            </button>
        </div>
      </div>

      {/* --- MAIN PRODUCT CARD --- */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-50 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
        
        {/* Left: Responsive Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-square w-full max-w-[400px] mx-auto lg:max-w-none rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group">
            <img 
                src={product.image || "/logo192.png"} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </div>
          <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-[400px] mx-auto lg:max-w-none">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-slate-300 italic">
                Media {i}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Content Section */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <div className="mb-6">
            <span className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                {product.category || product.mainCategory || "Store Catalog"}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mt-2">
                {product.name}
            </h1>
          </div>

          <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-8 font-medium max-w-lg mx-auto lg:mx-0">
            {product.overview || "Authentic South Indian flavor delivered fresh. Each batch is prepared by traditional artisans to maintain nostalgic taste and premium quality standards."}
          </p>

          <div className="flex items-baseline justify-center lg:justify-start gap-4 mb-8 md:mb-10">
            <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
                {formatPriceINR(product.price)}
            </span>
            <span className="text-lg text-slate-300 line-through font-bold">
              ₹{getStrikePrice(product.price)}
            </span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                17% OFF
            </span>
          </div>

          {/* Brand Promise Labels - Scrollable on very small screens */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 border-y border-slate-100 py-6 md:py-8 mb-8">
            <div className="text-center">
              <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Authenticity</p>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-700">{product.authenticityLabel || "Original"}</p>
            </div>
            <div className="text-center border-x border-slate-100 px-1">
              <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Logistics</p>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-700">{product.logisticsLabel || "Secure"}</p>
            </div>
            <div className="text-center">
              <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Support</p>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-700">{product.supportLabel || "24/7"}</p>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="grid grid-cols-2 gap-y-3 md:gap-y-4 mb-8 md:mb-10 max-w-sm mx-auto lg:mx-0">
            {[
              product.feature1 || "100% Veg",
              product.feature2 || "Hand-crafted",
              product.feature3 || "Hygienic",
              product.feature4 || "Traditional"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 justify-center lg:justify-start">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[8px] md:text-[10px] font-bold">✓</div>
                <span className="text-[10px] md:text-xs font-bold text-slate-600">{feature}</span>
              </div>
            ))}
          </div>

          <button disabled className="w-full py-4 md:py-5 bg-slate-100 text-slate-400 font-black uppercase tracking-[0.2em] rounded-2xl border border-slate-200 cursor-not-allowed text-[10px]">
            Add to Cart (Customer View)
          </button>
        </div>
      </div>

      {/* --- DETAILED DESCRIPTION SECTION --- */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 shadow-sm border border-slate-50">
        <h3 className="text-[10px] font-black uppercase text-slate-900 tracking-[0.2em] mb-6 md:mb-8 flex items-center gap-4">
            <span className="w-8 md:w-12 h-[2px] bg-emerald-500"></span> Product Details
        </h3>
        <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-loose font-medium text-xs md:text-sm">
                {product.description || "Detailed description and nutritional information will be listed here in a future update. This includes ingredient sourcing, shelf life, and allergen information."}
            </p>
        </div>
      </div>

    </motion.div>
  );
};

export default ProductDetailView;