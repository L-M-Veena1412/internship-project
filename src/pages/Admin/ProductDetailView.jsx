import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../../data/mockData';

const ProductDetailView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Find the product by ID from your mock data
  // If no ID is provided in the URL, default to the first product
  const product = mockProducts.find(p => p.id.toString() === productId) || mockProducts[0];

  if (!product) {
    return (
      <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Product Not Found</p>
        <button onClick={() => navigate('/admin/products')} className="mt-4 text-emerald-600 font-bold underline">Return to Inventory</button>
      </div>
    );
  }

  // Safety function to handle price formatting and math
  const getStrikePrice = (price) => {
    if (!price) return 0;
    // Ensure price is a string before replacing commas, then convert to number
    const numericPrice = Number(price.toString().replace(/,/g, ''));
    return (numericPrice + 500).toLocaleString();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto pb-20 px-4 space-y-8"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Live Preview</h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">How customers see this product</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
                Edit Product
            </button>
            <button 
                onClick={() => navigate('/admin/products')}
                className="px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
                Back to List
            </button>
        </div>
      </div>

      {/* Product Information Card */}
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-50 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left: Image Gallery Preview */}
        <div className="space-y-6">
          <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-300 italic">
                Media {i}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                {product.category || "Snacks & Traditional Sweets"}
            </span>
            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mt-2">
                {product.name}
            </h1>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
            {product.overview || "Authentic South Indian flavor delivered fresh. Each batch is prepared by traditional artisans to maintain nostalgic taste."}
          </p>

          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{product.price}</span>
            <span className="text-xl text-slate-300 line-through font-bold">
              ₹{getStrikePrice(product.price)}
            </span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                17% OFF
            </span>
          </div>

          {/* Brand Promise Labels */}
          <div className="grid grid-cols-3 gap-4 border-y border-slate-100 py-8 mb-8">
            <div className="text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Authenticity</p>
              <p className="text-[10px] font-bold text-slate-700">{product.authenticityLabel || "Taste Guaranteed"}</p>
            </div>
            <div className="text-center border-x border-slate-100 px-2">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Logistics</p>
              <p className="text-[10px] font-bold text-slate-700">{product.logisticsLabel || "Damage Covered"}</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Support</p>
              <p className="text-[10px] font-bold text-slate-700">{product.supportLabel || "24/7 Support"}</p>
            </div>
          </div>

          {/* Checklist Features */}
          <div className="grid grid-cols-2 gap-y-4 mb-10">
            {[
              product.feature1 || "100% Veg",
              product.feature2 || "Hand-crafted",
              product.feature3 || "Hygienic",
              product.feature4 || "Traditional"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-bold">✓</div>
                <span className="text-xs font-bold text-slate-600">{feature}</span>
              </div>
            ))}
          </div>

          <button disabled className="w-full py-5 bg-slate-100 text-slate-400 font-black uppercase tracking-[0.2em] rounded-2xl border border-slate-200 cursor-not-allowed">
            Add to Cart (Customer Only)
          </button>
        </div>
      </div>

      {/* Detailed Description Section */}
      <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl border border-slate-50">
        <h3 className="text-xs font-black uppercase text-slate-900 tracking-[0.2em] mb-8 flex items-center gap-4">
            <span className="w-12 h-[2px] bg-emerald-500"></span> Product Story & Details
        </h3>
        <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-loose font-medium text-sm">
                {product.description || "Detailed description will appear here. This section covers ingredients, nutritional facts, and the story behind the product's origin."}
            </p>
        </div>
      </div>

    </motion.div>
  );
};

export default ProductDetailView;