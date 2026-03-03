import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPriceINR } from '../utils/currency';
import Button from './Button';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add to Cart clicked for product:', product.name);
    addToCart(product, 1);
    console.log('Calling showToast with message');
    showToast('Item added to cart successfully');
  };

  const handleImageError = (e) => {
    // Fallback to a placeholder image if the original fails to load
    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop'; // Fresh produce fallback
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-custom shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-olive-green text-white px-2 py-1 text-xs font-medium rounded">
              Featured
            </span>
          )}
        </div>
        
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-dark-text text-base sm:text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-xs sm:text-sm text-gray-600 ml-1">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xl sm:text-2xl font-bold text-olive-green">
              {formatPriceINR(product.price)}
            </span>
            
            <Button
              variant="primary"
              size="small"
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full sm:w-auto py-3 sm:py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs sm:text-sm">Add</span>
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
