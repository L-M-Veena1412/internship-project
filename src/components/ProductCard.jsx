import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPriceINR } from '../utils/currency';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-custom shadow-soft hover:shadow-xl border border-gray-200 transition-all duration-300 overflow-hidden group relative flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="block flex-1 flex flex-col">
        {/* Image Container with Fixed Aspect Ratio */}
        <div className="relative aspect-[4/5] w-full bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
          
          {/* Discount Badge - Top Left */}
          {product.discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          
          {/* Featured Badge */}
          {product.featured && !product.discount && (
            <span className="absolute top-3 left-3 bg-olive-green text-white px-2 py-1 text-xs font-medium rounded shadow-sm">
              Featured
            </span>
          )}
          
          {/* Add to Cart Button - Bottom Right */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Add to cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1 mt-auto">
          {/* Product Name - Limited to 2 lines */}
          <h3 className="font-semibold text-dark-text text-sm mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
            {product.name}
          </h3>
          
          {/* Category */}
          <p className="text-gray-500 text-xs mb-2 line-clamp-1">
            {product.category.replace('-', ' ')}
          </p>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs text-gray-600 ml-1">
              {product.rating}
            </span>
          </div>
          
          {/* Price Display - Consistent Alignment */}
          <div className="flex items-center gap-2">
            {/* Current Price - Bold Black */}
            <span className="text-base font-bold text-black">
              {formatPriceINR(product.price)}
            </span>
            
            {/* MRP - Strikethrough Gray */}
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPriceINR(product.mrp)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;