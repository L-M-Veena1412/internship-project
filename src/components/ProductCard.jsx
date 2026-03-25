import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPriceINR } from '../utils/currency';
import { getBaseVariantWeight, getVariantScaledPrice } from '../utils/variantPricing';
import SafeImage from './SafeImage';

const ProductCard = ({ product }) => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // --- MENTOR'S UPDATED LOGIC START ---
  // Using the product.image string directly as the src.
  // We handle potential broken links with a fallback image.
  const handleImageError = (e) => {
    e.target.src = '/logo192.png'; // Using existing logo as fallback
  };
  // --- MENTOR'S UPDATED LOGIC END ---

  const cartItem = cart.find(item => {
    if (selectedVariant) {
      return item.product_qty_id === selectedVariant;
    }
    return item.id === product.id && !item.product_qty_id;
  });
  const currentQty = cartItem ? cartItem.quantity : 0;

  const hasVariants = product.variants && product.variants.length > 0;
  
  const selectedVariantData = selectedVariant 
    ? product.variants.find(v => v.id === selectedVariant)
    : null;
  const availableStock = selectedVariantData ? selectedVariantData.qty : product.stock || 0;

  const baseVariantWeight = getBaseVariantWeight(product.variants || []);
  const currentDisplayPrice = selectedVariantData
    ? getVariantScaledPrice(product.price, selectedVariantData.weight, baseVariantWeight)
    : Number(product.price || 0);
  const currentDisplayMrp = product.originalPrice && product.originalPrice > product.price
    ? selectedVariantData
      ? getVariantScaledPrice(product.originalPrice, selectedVariantData.weight, baseVariantWeight)
      : Number(product.originalPrice || 0)
    : null;

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const isOutOfStock = availableStock === 0;

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
    
    if (availableStock <= currentQty) {
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
      whileHover={{ y: -2 }}
      className="bg-white flex flex-col h-full"
    >
      <div className="relative aspect-square w-full bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <SafeImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>
        
        <div className="absolute bottom-2 right-2 z-10">
          {currentQty > 0 ? (
            <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200">
              <button 
                onClick={handleDecreaseQty} 
                className="w-6 h-6 flex items-center justify-center text-pink-500 hover:text-pink-600 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-6 text-center text-xs font-semibold text-green-600">{currentQty}</span>
              <button 
                onClick={handleIncreaseQty} 
                className="w-6 h-6 flex items-center justify-center text-green-600 hover:text-green-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col pt-4 pb-3 px-3">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xs ${i < Math.floor(product.rating || 4) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
          <span className="text-xs text-gray-600 font-medium">
            {product.rating || 4.5}
          </span>
        </div>

        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 leading-tight mb-2 hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="text-gray-400 text-xs mb-2">
          {hasVariants && selectedVariant
            ? product.variants.find(v => v.id === selectedVariant)?.weight || '1 pack (88 g)'
            : '1 pack (88 g)'}
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="bg-green-700 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
            {formatPriceINR(currentDisplayPrice)}
          </span>
          
          {currentDisplayMrp && (
            <span className="text-gray-400 text-xs line-through whitespace-nowrap">
              {formatPriceINR(currentDisplayMrp)}
            </span>
          )}
        </div>

        {currentDisplayMrp && (
          <div className="text-green-600 text-xs font-medium">
            ₹{Math.round(currentDisplayMrp - currentDisplayPrice)} OFF
          </div>
        )}

        {isOutOfStock && (
          <div className="mt-2">
            <span className="text-red-500 text-xs font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;