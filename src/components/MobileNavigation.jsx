import React, { useState } from 'react';
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
    <div className="bg-white h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        <Link
          to="/"
          onClick={handleLinkClick}
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            isActive('/') 
              ? 'bg-green-50 text-green-700 border-l-4 border-green-700' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium">Home</span>
        </Link>

        <button
          onClick={handleShopClick}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
            isActive('/shop') 
              ? 'bg-green-50 text-green-700 border-l-4 border-green-700' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="font-medium">Shop</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <Link
          to="/about"
          onClick={handleLinkClick}
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            isActive('/about') 
              ? 'bg-green-50 text-green-700 border-l-4 border-green-700' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">About</span>
        </Link>

        <Link
          to="/contact"
          onClick={handleLinkClick}
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            isActive('/contact') 
              ? 'bg-green-50 text-green-700 border-l-4 border-green-700' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">Contact</span>
        </Link>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Account Section */}
        <div className="space-y-1">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </div>
            </button>
          ) : (
            <Link
              to="/login"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive('/login')
                  ? 'bg-green-50 text-green-700 border-l-4 border-green-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">Login</span>
              </div>
            </Link>
          )}

          </div>
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
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={handleOutsideClick}
        />
      )}
      
      {/* Drawer Container */}
      <div 
        className={`fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '75%' }}
      >
        <div className="absolute inset-0 bg-white shadow-xl overflow-y-auto">
          {getCurrentPanel()}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
