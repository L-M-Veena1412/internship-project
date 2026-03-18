import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPriceINR } from '../utils/currency';
import { getBaseVariantWeight, getVariantScaledPrice } from '../utils/variantPricing';

const ProductCard = ({ product }) => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);

  const cartItem = cart.find(item => {
    if (selectedVariant) {
      return item.product_qty_id === selectedVariant;
    }
    return item.id === product.id && !item.product_qty_id;
  });
  const currentQty = cartItem ? cartItem.quantity : 0;

  // Check if product has variants
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Get selected variant stock if applicable
  const selectedVariantData = selectedVariant 
    ? product.variants.find(v => v.id === selectedVariant)
    : null;
  const availableStock = selectedVariantData ? selectedVariantData.qty : 0;

  const baseVariantWeight = getBaseVariantWeight(product.variants || []);
  const currentDisplayPrice = selectedVariantData
    ? getVariantScaledPrice(product.price, selectedVariantData.weight, baseVariantWeight)
    : Number(product.price || 0);
  const currentDisplayMrp = Number(product.mrp || 0) > Number(product.price || 0)
    ? selectedVariantData
      ? getVariantScaledPrice(product.mrp, selectedVariantData.weight, baseVariantWeight)
      : Number(product.mrp || 0)
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasVariants && !selectedVariant) {
      alert('Please select a weight/variant');
      return;
    }
    
    try {
      await addToCart(product, 1, selectedVariant);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const handleIncreaseQty = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (hasVariants && !selectedVariant) {
      alert('Please select a weight/variant');
      return;
    }
    
    if (hasVariants && availableStock <= currentQty) {
      alert('Not enough stock available');
      return;
    }
    
    try {
      await updateQuantity(product.id, currentQty + 1);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleDecreaseQty = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (currentQty > 1) {
      updateQuantity(product.id, currentQty - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl border border-gray-100 flex flex-col h-full relative p-3 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Image Link */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square w-full bg-[#F8F9F7] rounded-2xl overflow-hidden mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 mix-blend-multiply"
          />
          
          {/* 1. Container now allows image to be visible outside its 'bounds' if needed */}
<div className="relative bg-gray-50 rounded-3xl p-4 flex items-center justify-center"> 
  {/* 2. 'Organic' tag removed entirely */}
  
  {/* 3. Image is now the hero without the clipping wrapper */}
  <img 
    src={product.image} 
    alt={product.name} 
    className="w-full h-32 object-contain transform hover:scale-110 transition-transform duration-300" 
  />
</div>

          {product.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 text-[9px] font-black rounded-lg">
              -{product.discount}%
            </div>
          )}
        </div>
      </Link>

      {/* Details Container */}
      <div className="flex flex-col flex-1 px-1">
        {/* Clickable Category Badge */}
        <Link 
          to={`/shop?category=${product.category}`}
          className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.1em] mb-1 hover:text-olive-green transition-colors w-fit"
        >
          {product.category?.replace(/-/g, ' ')}
        </Link>

        {/* Product Name Link */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-800 text-xs md:text-sm line-clamp-2 leading-tight min-h-[32px] mb-2 hover:text-olive-green transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-[10px] ${i < Math.floor(product.rating || 4) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
          <span className="text-[9px] font-bold text-gray-400">({product.reviews || '48'})</span>
        </div>

        {/* Variant Selector */}
        {hasVariants && product.variants.length > 0 && (
          <div className="mb-3 relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowVariantDropdown(!showVariantDropdown);
              }}
              className="w-full text-left px-2 py-1.5 text-xs bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span className="font-semibold text-gray-700">
                {selectedVariant 
                  ? `${product.variants.find(v => v.id === selectedVariant)?.weight} - ${formatPriceINR(currentDisplayPrice)}` 
                  : 'Select Weight'}
              </span>
            </button>
            
            {showVariantDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {product.variants.map((variant) => (
                  (() => {
                    const variantPrice = getVariantScaledPrice(product.price, variant.weight, baseVariantWeight);
                    return (
                  <button
                    key={variant.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(variant.id);
                      setShowVariantDropdown(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-xs border-b last:border-b-0 hover:bg-gray-100 transition-colors ${
                      selectedVariant === variant.id ? 'bg-olive-green/10' : ''
                    }`}
                  >
                    <span className="font-medium">{variant.weight} - {formatPriceINR(variantPrice)}</span>
                    <span className="text-gray-500 text-[10px]"> ({variant.qty} in stock)</span>
                  </button>
                    );
                  })()
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Price & Action Row */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-black text-gray-900">
              {formatPriceINR(currentDisplayPrice)}
            </span>
            {currentDisplayMrp && currentDisplayMrp > currentDisplayPrice && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatPriceINR(currentDisplayMrp)}
              </span>
            )}
          </div>

          <div className="flex items-center">
            {currentQty === 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-8 h-8 md:w-9 md:h-9 bg-olive-green text-white rounded-full flex items-center justify-center shadow-lg shadow-olive-green/20 hover:scale-110 active:scale-95 transition-transform"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-olive-green/10 border border-olive-green/20 rounded-full px-1.5 py-1">
                <button onClick={handleDecreaseQty} className="w-5 h-5 flex items-center justify-center text-olive-green font-bold text-xs">-</button>
                <span className="text-xs font-black text-gray-900 min-w-[12px] text-center">{currentQty}</span>
                <button onClick={handleIncreaseQty} className="w-5 h-5 flex items-center justify-center text-olive-green font-bold text-xs">+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;