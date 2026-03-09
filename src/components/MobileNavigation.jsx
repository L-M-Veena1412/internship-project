import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MobileNavigation = ({ isOpen, onClose }) => {
  const [navigationStack, setNavigationStack] = useState(['main']);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  
  const slideIndex = navigationStack.length - 1;

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response && response.data) setCategories(response.data);
      } catch (error) {
        setCategories([]);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handleSubcategoryClick = (subcategory) => {
    onClose();
    setTimeout(() => {
        setNavigationStack(['main']);
        setSelectedCategory(null);
    }, 300);
    navigate(`/shop?subcategory=${subcategory.slug}`);
  };

  const handleLinkClick = () => {
    onClose();
    setTimeout(() => setNavigationStack(['main']), 300);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setNavigationStack(['main', 'subcategories']);
  };

  const handleBackClick = () => {
    setNavigationStack(prev => prev.slice(0, -1));
  };

  const handleOutsideClick = () => {
    onClose();
    setTimeout(() => {
        setNavigationStack(['main']);
        setSelectedCategory(null);
    }, 300);
  };

  const isActive = (path) => location.pathname === path;

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
        style={{ width: '85%' }}
      >
        <div 
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ 
            width: '200%', 
            transform: `translateX(-${(slideIndex * 100) / 2}%)` 
          }}
        >
          {/* PANEL 1: MAIN MENU */}
          <div className="w-1/2 h-full flex flex-col bg-white">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                 <svg className="w-6 h-6 text-olive-green" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                 <span className="font-black text-gray-800 tracking-tight">Menu</span>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <Link to="/" onClick={handleLinkClick} className={`flex items-center px-4 py-3 rounded-lg ${isActive('/') ? 'bg-olive-green/10 text-olive-green font-bold' : 'text-gray-700 font-medium'}`}>
                Home
              </Link>

              {/* DIRECT CATEGORY LIST */}
              <div className="pt-4 pb-2">
                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Categories</p>
                {categories.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleCategoryClick(cat)} 
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="font-semibold text-sm">{cat.name}</span>
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-red-500 font-bold">Logout</button>
              ) : (
                <Link to="/login" onClick={handleLinkClick} className="block px-4 py-3 text-olive-green font-bold">Login / Register</Link>
              )}
            </nav>
          </div>

          {/* PANEL 2: SUBCATEGORIES */}
          <div className="w-1/2 h-full flex flex-col bg-white border-l border-gray-100">
            <div className="flex items-center p-4 border-b">
              <button onClick={handleBackClick} className="mr-4 p-1">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-lg font-bold text-gray-800">{selectedCategory?.name}</h2>
            </div>
            
            <nav className="p-4 overflow-y-auto">
              <button 
                onClick={() => {
                  // FIX: Pass the SLUG instead of NAME to correctly trigger filters in Shop.jsx
                  navigate(`/shop?category=${selectedCategory?.slug}`);
                  onClose();
                  // Reset the stack so it starts at 'main' the next time it opens
                  setTimeout(() => {
                    setNavigationStack(['main']);
                    setSelectedCategory(null);
                  }, 300);
                }}
                className="w-full text-left px-4 py-3 mb-2 bg-olive-green/5 text-olive-green font-bold rounded-lg"
              >
                View All {selectedCategory?.name}
              </button>

              {selectedCategory?.subcategories?.map((sub) => (
                <button 
                  key={sub.id} 
                  onClick={() => handleSubcategoryClick(sub)} 
                  className="w-full text-left px-4 py-3 border-b border-gray-50 text-gray-600 text-sm font-medium active:bg-gray-50"
                >
                  {sub.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;