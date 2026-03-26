import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPriceINR } from '../utils/currency';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => mockProducts.find(p => p.id === parseInt(id)), [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return mockProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 12);
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [id]);

  if (!product) return <div className="py-20 text-center uppercase font-black">Product Not Found</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf4] pb-10">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-purple-600 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-800 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* LEFT: Image Box */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-center aspect-square overflow-hidden self-start">
            <motion.img
              key={id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={product.image || "/logo192.png"}
              alt={product.name}
              className="max-h-full w-auto object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* RIGHT: Product Sidebar + Tabs */}
          <div className="flex flex-col">
            <div className="mb-1">
                <span className="text-purple-600 font-black text-[10px] uppercase tracking-[0.2em]">{product.category}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-800 leading-tight mb-2 tracking-tighter uppercase">
              {product.name}
            </h1>
            
            <p className="text-gray-500 text-sm font-medium mb-4 leading-relaxed border-l-4 border-purple-100 pl-4">
              {product.description}
            </p>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-black text-gray-900">{formatPriceINR(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through font-bold mb-0.5">{formatPriceINR(product.originalPrice)}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase mb-1">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mb-6 py-3 border-y border-gray-100">
               <div className="text-center">
                  <p className="text-[8px] font-black text-gray-300 uppercase">Authenticity</p>
                  <p className="text-[10px] font-bold text-gray-700 leading-tight">Taste Guaranteed</p>
               </div>
               <div className="text-center border-x border-gray-100">
                  <p className="text-[8px] font-black text-gray-300 uppercase">Logistics</p>
                  <p className="text-[10px] font-bold text-gray-700 leading-tight">Damage Covered</p>
               </div>
               <div className="text-center">
                  <p className="text-[8px] font-black text-gray-300 uppercase">Support</p>
                  <p className="text-[10px] font-bold text-gray-700 leading-tight">24/7 Support</p>
               </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-gray-400 font-bold hover:text-purple-600 transition-colors">-</button>
                <span className="w-8 text-center font-black text-gray-800 text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-gray-400 font-bold hover:text-purple-600 transition-colors">+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 bg-purple-600 text-white font-black py-3 rounded-xl shadow-md hover:bg-purple-700 active:scale-95 transition-all uppercase tracking-widest text-[10px]">
                Add to Cart
              </button>
            </div>

            {/* --- MOVED TABS SECTION: NOW INSIDE THE RIGHT COLUMN --- */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex gap-6 border-b border-gray-100 mb-4">
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'details' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400 border-b-2 border-transparent'}`}
                >
                  Product Details
                </button>
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'overview' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400 border-b-2 border-transparent'}`}
                >
                  Overview
                </button>
              </div>

              <div className="animate-fadeIn">
                {activeTab === 'details' ? (
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <h4 className="text-[8px] font-black text-purple-600 uppercase mb-1">Ingredients</h4>
                      <p className="text-[11px] text-gray-600 font-medium leading-snug">
                        Sugar, Gram Flour, Pure Ghee, Cardamom, Edible Oil. No added preservatives.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <h4 className="text-[8px] font-black text-purple-600 uppercase mb-1">Shelf Life</h4>
                      <p className="text-[11px] text-gray-600 font-medium leading-snug">
                        Best within 30 days. Store in a cool, dry place in an airtight container.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-[11px] font-medium leading-relaxed">
                      Authentic South Indian flavor delivered fresh. Each batch is prepared by traditional artisans to maintain nostalgic taste.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                       <p className="text-[10px] text-gray-500 font-bold">✓ 100% Veg</p>
                       <p className="text-[10px] text-gray-500 font-bold">✓ Hand-crafted</p>
                       <p className="text-[10px] text-gray-500 font-bold">✓ Hygienic</p>
                       <p className="text-[10px] text-gray-500 font-bold">✓ Traditional</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SLIDER (remains at the bottom across full width) */}
        {relatedProducts.length > 0 && (
          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter leading-none">More Like This</h2>
                <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mt-1">You might also like</p>
              </div>
              <Link to="/shop" className="text-[9px] font-black text-purple-600 uppercase tracking-widest border-b-2 border-purple-200 pb-1">
                View Shop
              </Link>
            </div>

            <div className="relative group">
              <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth">
                {relatedProducts.map((p) => (
                  <div key={p.id} className="min-w-[32%] sm:min-w-[24%] lg:min-w-[15.5%] snap-start snap-always">
                    <div className="h-full bg-white rounded-2xl border border-gray-50 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                      <ProductCard product={p} />
                    </div>
                  </div>
                ))}
                <div className="min-w-[10px] h-1 shrink-0" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;