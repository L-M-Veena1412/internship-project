import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SubcategoryCard = ({ subcategory, categorySlug, index }) => {
  const getSubcategoryImage = (slug) => {
    const images = {
      'local-seasonal': 'https://images.unsplash.com/photo-1590430379182-37b6787f592e?w=400&h=300&fit=crop',
      'exotic': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop',
      'leafy': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
      'root': 'https://images.unsplash.com/photo-1445282768811-6a790c3c3529?w=400&h=300&fit=crop',
      'bulb': 'https://images.unsplash.com/photo-1518977676601-b5f672357bb5?w=400&h=300&fit=crop',
      'fruiting': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
      'citrus': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
      'tropical': 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&h=300&fit=crop',
      'berries': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop',
      'exotic-fruits': 'https://images.unsplash.com/photo-1546630392-34680b5395c6?w=400&h=300&fit=crop',
      'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      'cheese': 'https://images.unsplash.com/photo-1483695028932-b5c0ce5606b3?w=400&h=300&fit=crop',
      'butter': 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop',
      'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
      'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      'cakes': 'https://images.unsplash.com/photo-1464349095981-b1df89268b01?w=400&h=300&fit=crop',
      'cookies': 'https://images.unsplash.com/photo-1499636133215-a44bd298d76b?w=400&h=300&fit=crop',
      'pastries': 'https://images.unsplash.com/photo-1559329007-406870828b39?w=400&h=300&fit=crop'
    };
    
    return images[slug] || 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop';
  };
  
  return (
    <Link to={`/category/${categorySlug}/${subcategory.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ scale: 1.03, y: -5 }}
        className="bg-white rounded-custom shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer overflow-hidden group"
      >
        <div className="relative h-32">
          <img
            src={getSubcategoryImage(subcategory.slug)}
            alt={subcategory.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-dark-text text-lg mb-2">
            {subcategory.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3">
            Browse our selection of {subcategory.name.toLowerCase()}
          </p>
          
          <div className="flex items-center text-olive-green text-sm font-medium">
            <span>Browse Products</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default SubcategoryCard;
