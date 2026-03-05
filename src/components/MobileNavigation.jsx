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
  const { isLoggedIn, logout } = useAuth();
  
  // Logic for sliding: calculate transform based on stack length
  // 0 = Main, 1 = Categories, 2 = Subcategories
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

  const handleShopClick = () => setNavigationStack(['main', 'categories']);
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setNavigationStack(['main', 'categories', 'subcategories']);
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={handleOutsideClick}
        />
      )}
      
      {/* Main Drawer Container */}
      <div 
        className={`fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 ease-in-out bg-white shadow-xl overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '80%' }}
      >
        {/* THE SLIDING TRACK: This moves left/right based on navigationStack */}
        <div 
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ 
            width: '300%', // 3 panels wide
            transform: `translateX(-${(slideIndex * 100) / 3}%)` 
          }}
        >
          {/* PANEL 1: MAIN MENU */}
          <div className="w-1/3 h-full flex flex-col bg-white">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={onClose} className="p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <nav className="p-4 space-y-1">
              <Link to="/" onClick={handleLinkClick} className={`flex items-center px-4 py-3 rounded-lg ${isActive('/') ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}>
                <span className="font-medium">Home</span>
              </Link>
              <button onClick={handleShopClick} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50">
                <span className="font-medium">Shop</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
              </button>
              <div className="border-t my-4"></div>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-gray-700 font-medium">Logout</button>
              ) : (
                <Link to="/login" onClick={handleLinkClick} className="block px-4 py-3 text-gray-700 font-medium">Login</Link>
              )}
            </nav>
          </div>

          {/* PANEL 2: CATEGORIES */}
          <div className="w-1/3 h-full flex flex-col bg-white border-l">
            <div className="flex items-center p-4 border-b">
              <button onClick={handleBackClick} className="mr-4"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <h2 className="text-lg font-semibold">Categories</h2>
            </div>
            <nav className="p-4 overflow-y-auto">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => handleCategoryClick(cat)} className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-50">
                  <span>{cat.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                </button>
              ))}
            </nav>
          </div>

          {/* PANEL 3: SUBCATEGORIES */}
          <div className="w-1/3 h-full flex flex-col bg-white border-l">
            <div className="flex items-center p-4 border-b">
              <button onClick={handleBackClick} className="mr-4"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <h2 className="text-lg font-semibold">{selectedCategory?.name}</h2>
            </div>
            <nav className="p-4 overflow-y-auto">
              {selectedCategory?.subcategories?.map((sub) => (
                <button key={sub.id} onClick={() => handleSubcategoryClick(sub)} className="w-full text-left px-4 py-3 border-b border-gray-50">
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