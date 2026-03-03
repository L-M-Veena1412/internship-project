import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { getCategories } from '../services/api';

const MobileNavigation = ({ isOpen, onClose }) => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Set empty categories to prevent crashes
        setCategories([]);
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleLinkClick = () => {
    onClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 w-72 h-full bg-white shadow-xl z-50 md:hidden overflow-y-auto"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark-text">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive('/') 
                      ? 'bg-olive-green text-white' 
                      : 'hover:bg-gray-100 text-dark-text'
                  }`}
                >
                  Home
                </Link>

                {/* Shop with Categories */}
                <div className="border-t border-gray-200 pt-2">
                  <Link
                    to="/shop"
                    onClick={handleLinkClick}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      isActive('/shop') 
                        ? 'bg-olive-green text-white' 
                        : 'hover:bg-gray-100 text-dark-text'
                    }`}
                  >
                    Shop
                  </Link>
                  
                  {/* Categories Accordion */}
                  <div className="mt-2 space-y-1">
                    {categories && categories.map((category) => (
                      <div key={category.id} className="ml-4">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <span className="text-gray-700">{category.name}</span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              expandedCategories.includes(category.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Subcategories */}
                        <AnimatePresence>
                          {expandedCategories.includes(category.id) && category.subcategories && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 py-2 space-y-1">
                                {category.subcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory.id}
                                    to={`/shop?category=${category.slug}/${subcategory.slug}`}
                                    onClick={handleLinkClick}
                                    className="block px-3 py-2 text-xs text-gray-600 hover:text-olive-green hover:bg-gray-50 rounded transition-colors"
                                  >
                                    {subcategory.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/about"
                  onClick={handleLinkClick}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive('/about') 
                      ? 'bg-olive-green text-white' 
                      : 'hover:bg-gray-100 text-dark-text'
                  }`}
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  onClick={handleLinkClick}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive('/contact') 
                      ? 'bg-olive-green text-white' 
                      : 'hover:bg-gray-100 text-dark-text'
                  }`}
                >
                  Contact
                </Link>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;
