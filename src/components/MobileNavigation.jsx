import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCategories } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MobileNavigation = ({ isOpen, onClose }) => {
  const [navigationStack, setNavigationStack] = useState(['main']);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { isLoggedIn, logout } = useAuth();
  
  // Calculate total cart items with fallback
  const cartItemCount = (cartItems || []).reduce((total, item) => total + (item?.quantity || 0), 0);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    onClose(); // Close drawer after logout
  };

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubcategoryClick = (subcategory) => {
    // Close drawer immediately
    onClose();
    // Reset navigation state
    setNavigationStack(['main']);
    setSelectedCategory(null);
    // Navigate to shop page with subcategory parameter
    navigate(`/shop?subcategory=${subcategory.slug}`);
    // Scroll to top after navigation
    window.scrollTo(0, 0);
  };

  const handleLinkClick = () => {
    onClose();
    setNavigationStack(['main']);
  };

  const handleShopClick = () => {
    setNavigationStack(['main', 'categories']);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setNavigationStack(['main', 'categories', 'subcategories']);
  };

  const handleBackClick = () => {
    setNavigationStack(prev => prev.slice(0, -1));
    if (navigationStack.length === 2) {
      setSelectedCategory(null);
    }
  };

  const handleOutsideClick = () => {
    onClose();
    setNavigationStack(['main']);
    setSelectedCategory(null);
  };

  const isActive = (path) => location.pathname === path;

  const renderMainPanel = () => (
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

        <button
          onClick={handleShopClick}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
            isActive('/shop') 
              ? 'bg-olive-green text-white' 
              : 'hover:bg-gray-100 text-dark-text'
          }`}
        >
          <span>Shop</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

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

        {/* Divider */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* Login/Logout */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between hover:bg-gray-100 text-dark-text"
          >
            <span>Logout</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        ) : (
          <Link
            to="/login"
            onClick={handleLinkClick}
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive('/login')
                ? 'bg-olive-green text-white' 
                : 'hover:bg-gray-100 text-dark-text'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Login</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </Link>
        )}

        {/* Cart */}
        <Link
          to="/cart"
          onClick={handleLinkClick}
          className={`block px-4 py-3 rounded-lg transition-colors ${
            isActive('/cart')
              ? 'bg-olive-green text-white' 
              : 'hover:bg-gray-100 text-dark-text'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>Cart</span>
            <div className="flex items-center">
              {cartItemCount > 0 && (
                <span className="bg-olive-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
                  {cartItemCount}
                </span>
              )}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Link>
      </nav>
    </div>
  );

  const renderCategoriesPanel = () => (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBackClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-dark-text">Categories</h2>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Categories List */}
      <nav className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between hover:bg-gray-100 text-dark-text"
          >
            <span>{category.name}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </nav>
    </div>
  );

  const renderSubcategoriesPanel = () => (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBackClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-dark-text">{selectedCategory?.name}</h2>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Subcategories List */}
      <nav className="space-y-2">
        {selectedCategory?.subcategories?.map((subcategory) => (
          <button
            key={subcategory.id}
            onClick={() => handleSubcategoryClick(subcategory)}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between hover:bg-gray-100 text-dark-text"
          >
            <span>{subcategory.name}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
        
        {(!selectedCategory?.subcategories || selectedCategory.subcategories.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No subcategories available</p>
          </div>
        )}
      </nav>
    </div>
  );

  const getCurrentPanel = () => {
    const currentLevel = navigationStack[navigationStack.length - 1];
    switch (currentLevel) {
      case 'categories':
        return renderCategoriesPanel();
      case 'subcategories':
        return renderSubcategoriesPanel();
      default:
        return renderMainPanel();
    }
  };

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
            onClick={handleOutsideClick}
          />
          
          {/* Drawer Container */}
          <div className="fixed top-0 left-0 w-72 h-full z-50 md:hidden overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={navigationStack.join('-')}
                initial={{ x: 288 }}
                animate={{ x: 0 }}
                exit={{ x: -288 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0 bg-white shadow-xl overflow-y-auto"
              >
                {getCurrentPanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;
