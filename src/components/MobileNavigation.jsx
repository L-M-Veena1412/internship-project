import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCategories } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import SafeImage from './SafeImage';

const MobileNavigation = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState('main');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
    setCurrentView('main');
    setSelectedCategory(null);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentView('subcategories');
  };

  const handleBackClick = () => {
    setCurrentView('main');
    setSelectedCategory(null);
  };

  const handleOutsideClick = () => {
    onClose();
    setTimeout(() => {
      setCurrentView('main');
      setSelectedCategory(null);
    }, 300);
  };

  const handleSubcategoryClick = (subcategory) => {
    onClose();
    setTimeout(() => {
      setCurrentView('main');
      setSelectedCategory(null);
    }, 300);
    navigate(`/shop?category=${selectedCategory.name}&subcategory=${subcategory.name}`);
  };

  const handleViewAllCategory = () => {
    onClose();
    setTimeout(() => {
      setCurrentView('main');
      setSelectedCategory(null);
    }, 300);
    navigate(`/shop?category=${selectedCategory?.slug}`);
  };

  const isActive = (path) => location.pathname === path;

  const slideVariants = {
    main: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    subcategories: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    exitMain: {
      x: -100,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeInOut' }
    },
    exitSubcategories: {
      x: 100,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeInOut' }
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[1000] md:hidden transition-opacity duration-300"
          onClick={handleOutsideClick}
        />
      )}
      
      {/* Main Drawer Container */}
      <div 
        className={`fixed top-0 left-0 h-full z-[1001] md:hidden transition-transform duration-300 ease-in-out bg-white shadow-xl overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '80%' }}
      >
        <div className="relative h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === 'main' && (
              <motion.div
                key="main"
                variants={slideVariants}
                initial="exitMain"
                animate="main"
                exit="exitMain"
                className="absolute inset-0 flex flex-col bg-white"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-olive-green" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    <span className="font-black text-gray-800 tracking-tight">Menu</span>
                  </div>
                  <button onClick={onClose} className="p-2 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Main Menu Content */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  <Link 
                    to="/" 
                    onClick={handleLinkClick} 
                    className={`flex items-center px-4 py-3 rounded-lg ${
                      isActive('/') ? 'bg-olive-green/10 text-olive-green font-bold' : 'text-gray-700 font-medium'
                    }`}
                  >
                    Home
                  </Link>

                  {/* Categories Section */}
                  <div className="pt-4 pb-2">
                    <p className="px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Categories</p>
                    {mockCategories && mockCategories.map((cat) => (
                      <button 
                        key={cat.id} 
                        onClick={() => handleCategoryClick(cat)} 
                        className="w-full flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <SafeImage
                            src={cat.image}
                            alt={cat.name}
                            className="w-8 h-8 object-cover rounded-lg"
                          />
                          <span className="font-semibold text-xs leading-relaxed text-left">{cat.name}</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>

                  {/* Contact & Socials Section */}
                  <div className="border-t border-gray-100 my-4 pt-4 px-4 space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[11px] break-all font-medium">support@organicstore.com</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm font-bold text-gray-800">+911169268569</span>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center justify-between pt-2 text-gray-400">
                      {/* ... Social links stay same ... */}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-4"></div>

                  {isLoggedIn ? (
                    <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-red-500 font-bold">
                      Logout
                    </button>
                  ) : (
                    <Link to="/login" onClick={handleLinkClick} className="block px-4 py-3 text-olive-green font-bold">
                      Login / Register
                    </Link>
                  )}
                </nav>
              </motion.div>
            )}

            {currentView === 'subcategories' && selectedCategory && (
              <motion.div
                key="subcategories"
                variants={slideVariants}
                initial="exitSubcategories"
                animate="subcategories"
                exit="exitSubcategories"
                className="absolute inset-0 flex flex-col bg-white"
              >
                {/* Subcategory Header */}
                <div className="flex items-center p-4 border-b">
                  <button onClick={handleBackClick} className="mr-4 p-1">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-bold text-gray-800">{selectedCategory.name}</h2>
                </div>
                
                {/* Subcategory Content */}
                <nav className="p-4 overflow-y-auto">
                  <button 
                    onClick={handleViewAllCategory}
                    className="w-full text-left px-4 py-3 mb-2 bg-olive-green/5 text-olive-green font-bold rounded-lg"
                  >
                    View All {selectedCategory.name}
                  </button>

                  {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 ? (
                    selectedCategory.subcategories.map((sub) => (
                      <button 
                        key={sub.id} 
                        onClick={() => handleSubcategoryClick(sub)} 
                        className="w-full text-left px-4 py-3 border-b border-gray-50 text-gray-600 text-sm font-medium leading-tight active:bg-gray-50"
                      >
                        {sub.name}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No subcategories available</p>
                      <button 
                        onClick={handleViewAllCategory}
                        className="mt-4 text-olive-green font-semibold text-sm"
                      >
                        View all products in {selectedCategory.name}
                      </button>
                    </div>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;