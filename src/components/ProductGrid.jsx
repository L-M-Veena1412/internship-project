import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error, isSwipeable = false, variant = 'default' }) => {
  
  // Skeleton Loader
  if (loading) {
    const skeletonClasses = variant === 'shop'
      ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
      : (isSwipeable ? "flex gap-3 overflow-hidden px-1" : "grid grid-cols-3 gap-2 px-1");

    return (
      <div className={skeletonClasses}>
        {[...Array(variant === 'shop' ? 6 : 3)].map((_, index) => (
          <div key={index} className="bg-white rounded-3xl border border-gray-100 p-3 animate-pulse">
            <div className="aspect-square bg-gray-100 rounded-2xl mb-3" />
            <div className="h-3 bg-gray-100 rounded w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  // Error or Empty State
  if (error || !products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <p className="text-gray-400 font-bold text-sm">No products found in this selection.</p>
      </div>
    );
  }

  // Layout Classes
  const gridClasses = variant === 'shop'
    ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" 
    : (isSwipeable 
        ? "flex overflow-x-auto gap-3 pb-4 px-2 scrollbar-hide snap-x snap-mandatory" 
        : "grid grid-cols-3 gap-2 px-1");

  return (
    <div className="relative w-full">
      <motion.div 
        layout
        className={gridClasses}
      >
        <AnimatePresence mode='popLayout'>
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={isSwipeable ? "min-w-[150px] md:min-w-[200px] snap-start" : ""}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProductGrid;