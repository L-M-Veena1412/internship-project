import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryGrid = ({ categories, title = "Shop by Category", showViewAll = true }) => {
  const categoryIcons = {
    'Fruits': '🍎', 'Vegetables': '🥬', 'Dairy': '🥛', 'Grains': '🌾',
    'Herbs': '🌿', 'Organic': '🌱', 'Fresh Produce': '🥕', 'Dairy Products': '🥛',
    'Bakery': '🍞', 'Beverages': '🥤', 'Snacks': '🍿', 'Pantry': '🥫', 'default': '🛒'
  };

  const getCategoryIcon = (categoryName) => {
    if (categoryIcons[categoryName]) return categoryIcons[categoryName];
    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (lowerName.includes(key.toLowerCase())) return icon;
    }
    return categoryIcons.default;
  };

  const getCategoryUrl = (category) => `/shop?category=${category.slug || category.id}`;

  return (
    <section className="py-6 sm:py-12 px-2">
      <div className="max-w-7xl mx-auto">
        {/* Tighter Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-3xl font-black text-dark-text leading-tight">
              {title}
            </h2>
            <p className="text-gray-500 text-[11px] sm:text-base">Organic picks for you</p>
          </div>
          
          {showViewAll && (
            <Link to="/shop" className="text-xs sm:text-sm text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full">
              View All
            </Link>
          )}
        </div>

        {/* Compact Grid: Using 4 columns on small mobile to match the "Quick Pick" feel */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link to={getCategoryUrl(category)} className="block text-center group">
                {/* Smaller, cleaner circular icons */}
                <div className="bg-white border border-gray-100 rounded-full w-full aspect-square flex items-center justify-center shadow-sm group-hover:bg-green-50 transition-colors mb-2">
                  <span className="text-xl sm:text-3xl">
                    {getCategoryIcon(category.name)}
                  </span>
                </div>
                
                <h3 className="text-[10px] sm:text-sm font-bold text-gray-700 line-clamp-1 group-hover:text-green-700 transition-colors">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;