import React, { useState } from 'react'; // Keep useState for other things if needed
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // 1. ADD THIS IMPORT
import { formatPriceINR } from '../utils/currency';
import { getBaseVariantWeight, getVariantScaledPrice } from '../utils/variantPricing';
import SafeImage from './SafeImage';

const ProductCard = ({ product }) => {
  const { cart = [], addToCart, updateQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist(); // 2. USE THE CONTEXT HOOK
  const [selectedVariant] = useState(null);

  const cartItem = cart.find(item => String(item.id) === String(product.id));
  const currentQty = cartItem ? cartItem.quantity : 0;

  // 3. REPLACE local state with Context state
  const isWishlisted = isInWishlist(product.id); 

  const hasVariants = product.variants && product.variants.length > 0;
  const availableStock = product.stock || 0;
  const isOutOfStock = availableStock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product, 1, selectedVariant);
    } catch (err) {
      console.error(err);
    }
  };

  // 4. UPDATE the toggle handler to use Context
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product); // This saves it to the global list
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      className="bg-white flex flex-col h-full group"
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <SafeImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* WISHLIST HEART ICON */}
        <button 
          onClick={handleToggleWishlist} // 5. USE the new handler
          className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:scale-110 active:scale-95"
        >
          <svg 
            className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        {/* ... ADD/QUANTITY BUTTONS section remains exactly as it was ... */}
        <div className="absolute bottom-2 right-2 z-10">
          {currentQty > 0 ? (
            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-0.5 border border-purple-100">
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(product.id, currentQty - 1); }} className="w-6 h-6 flex items-center justify-center text-purple-600 font-bold">-</button>
              <span className="w-5 text-center text-[11px] font-black text-gray-800">{currentQty}</span>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(product.id, currentQty + 1); }} className="w-6 h-6 flex items-center justify-center text-purple-600 font-bold">+</button>
            </div>
          ) : (
            <button onClick={handleAddToCart} disabled={isOutOfStock} className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all">+</button>
          )}
        </div>
      </div>

      {/* ... INFO SECTION remains exactly as it was ... */}
      <div className="flex flex-col pt-2 px-1">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-yellow-400 text-[10px]">★★★★★</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase">{product.rating || 4.5}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block mb-0.5">
          <h3 className="font-bold text-gray-800 text-[12px] line-clamp-2 leading-tight h-[30px] group-hover:text-purple-600">{product.name}</h3>
        </Link>
        <div className="text-gray-400 text-[10px] font-medium mb-1">{product.weight || '500g'}</div>
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <span className="bg-[#108910] text-white px-1.5 py-0.5 rounded text-[12px] font-black">{formatPriceINR(product.price)}</span>
          {product.originalPrice > product.price && <span className="text-gray-400 text-[11px] line-through font-medium">{formatPriceINR(product.originalPrice)}</span>}
        </div>
        {product.originalPrice > product.price && <div className="text-[#108910] text-[10px] font-black uppercase">₹{Math.round(product.originalPrice - product.price)} OFF</div>}
        {isOutOfStock && <div className="mt-1"><span className="text-red-500 text-[9px] font-black uppercase tracking-tighter">Out of Stock</span></div>}
      </div>
    </motion.div>
  );
};

export default ProductCard;