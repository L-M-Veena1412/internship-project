import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="relative overflow-hidden rounded-custom shadow-soft hover:shadow-medium transition-all duration-300 group cursor-pointer"
    >
      <Link to={`/category/${category.slug}`} className="block">
        <div className="relative h-64">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
            <p className="text-sm opacity-90 mb-3">{category.description}</p>
            
            {category.subcategories && (
              <div className="text-xs opacity-75 mb-3">
                {category.subcategories.length} subcategories available
              </div>
            )}
            
            <motion.div
              className="inline-flex items-center text-sm font-medium"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              Explore Subcategories
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
