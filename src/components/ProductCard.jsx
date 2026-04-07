import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPriceINR } from '../utils/currency';
import { getBaseVariantWeight, getVariantScaledPrice } from '../utils/variantPricing';
import SafeImage from './SafeImage';

const ProductCard = ({ product }) => {
  // Destructure cart (now guaranteed to be an array in Context)
  const { cart = [], addToCart, updateQuantity } = useCart();
  const [selectedVariant] = useState(null);

  // Compare IDs as strings to be 100% safe
  const cartItem = cart.find(item => String(item.id) === String(product.id));
  const currentQty = cartItem ? cartItem.quantity : 0;

  const hasVariants = product.variants && product.variants.length > 0;
  const availableStock = product.stock || 0;
  const isOutOfStock = availableStock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Logic inside addToCart is now optimistic, so this will be instant
      await addToCart(product, 1, selectedVariant);
    } catch (err) {
      console.error(err);
    }
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
        
        {/* ADD/QUANTITY BUTTONS */}
        <div className="absolute bottom-2 right-2 z-10">
          {currentQty > 0 ? (
            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-0.5 border border-purple-100">
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  updateQuantity(product.id, currentQty - 1); 
                }} 
                className="w-6 h-6 flex items-center justify-center text-purple-600 font-bold"
              >
                -
              </button>
              <span className="w-5 text-center text-[11px] font-black text-gray-800">{currentQty}</span>
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  updateQuantity(product.id, currentQty + 1); 
                }} 
                className="w-6 h-6 flex items-center justify-center text-purple-600 font-bold"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all"
            >
              <span className="text-xl leading-none">+</span>
            </button>
          )}
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="flex flex-col pt-2 px-1">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-yellow-400 text-[10px]">★★★★★</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase">{product.rating || 4.5}</span>
        </div>

        <Link to={`/product/${product.id}`} className="block mb-0.5">
          <h3 className="font-bold text-gray-800 text-[12px] line-clamp-2 leading-tight h-[30px] group-hover:text-purple-600">
            {product.name}
          </h3>
        </Link>

        <div className="text-gray-400 text-[10px] font-medium mb-1">
          {product.weight || '500g'}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <span className="bg-[#108910] text-white px-1.5 py-0.5 rounded text-[12px] font-black">
            {formatPriceINR(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-gray-400 text-[11px] line-through font-medium">
              {formatPriceINR(product.originalPrice)}
            </span>
          )}
        </div>

        {product.originalPrice > product.price && (
          <div className="text-[#108910] text-[10px] font-black uppercase">
            ₹{Math.round(product.originalPrice - product.price)} OFF
          </div>
        )}

        {isOutOfStock && (
          <div className="mt-1">
            <span className="text-red-500 text-[9px] font-black uppercase tracking-tighter">Out of Stock</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;