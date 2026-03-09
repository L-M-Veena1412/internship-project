import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-100"
    >
      <Link to={`/category/${category.slug}`} className="block">
        {/* Height reduced for mobile to keep "Products" visible below it */}
        <div className="relative h-32 sm:h-64">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 text-white">
            <h3 className="text-sm sm:text-2xl font-black mb-0.5 sm:mb-2 leading-tight">
              {category.name}
            </h3>
            <p className="text-[10px] sm:text-sm opacity-90 mb-2 line-clamp-1 sm:line-clamp-2">
              {category.description}
            </p>
            
            <div className="flex items-center text-[9px] sm:text-sm font-bold uppercase tracking-wider">
              <span>Explore</span>
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;