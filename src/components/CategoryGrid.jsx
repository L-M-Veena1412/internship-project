import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryGrid = ({ categories, title = "Shop by Category", showViewAll = true }) => {
  // Category icons mapping - using placeholder icons for now
  const categoryIcons = {
    'Fruits': '🍎',
    'Vegetables': '🥬',
    'Dairy': '🥛',
    'Grains': '🌾',
    'Herbs': '🌿',
    'Organic': '🌱',
    'Fresh Produce': '🥕',
    'Dairy Products': '🥛',
    'Bakery': '🍞',
    'Beverages': '🥤',
    'Snacks': '🍿',
    'Pantry': '🥫',
    'default': '🛒'
  };

  const getCategoryIcon = (categoryName) => {
    // Try exact match first
    if (categoryIcons[categoryName]) {
      return categoryIcons[categoryName];
    }
    
    // Try partial match
    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (key.toLowerCase() === lowerName || lowerName.includes(key.toLowerCase())) {
        return icon;
      }
    }
    
    return categoryIcons.default;
  };

  const getCategoryUrl = (category) => {
    return `/shop?category=${category.slug || category.id}`;
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-text mb-2">
              {title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
              Browse our wide selection of organic products organized by category
            </p>
          </div>
          
          {showViewAll && (
            <Link 
              to="/shop"
              className="inline-flex items-center px-4 py-2 text-olive-green hover:text-dark-green font-medium transition-colors duration-200"
            >
              View All
              <svg 
                className="w-4 h-4 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4-4m4 4H3" />
              </svg>
            </Link>
          )}
        </div>

        {/* Category Grid - Mobile First */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <Link 
                to={getCategoryUrl(category)}
                className="block text-center group"
              >
                {/* Circular Icon Container */}
                <div className="bg-gray-100 rounded-full w-full aspect-square flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 mb-3 group-hover:scale-110 transition-transform">
                  <div className="text-2xl sm:text-3xl lg:text-4xl">
                    {getCategoryIcon(category.name)}
                  </div>
                </div>
                
                {/* Category Label */}
                <h3 className="text-xs sm:text-sm font-medium text-dark-text line-clamp-2 leading-tight">
                  {category.name}
                </h3>
                
                {/* Item Count (Optional) */}
                {category.count && (
                  <p className="text-xs text-gray-500 mt-1">
                    {category.count} items
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Categories Button - Mobile Only */}
        {showViewAll && (
          <div className="text-center mt-8 sm:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: categories.length * 0.1 }}
            >
              <Link 
                to="/shop"
                className="inline-flex items-center px-6 py-3 bg-olive-green text-white font-medium rounded-lg hover:bg-dark-green transition-colors duration-200"
              >
                View All Categories
                <svg 
                  className="w-4 h-4 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4-4m4 4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
