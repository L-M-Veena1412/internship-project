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

    {/* NEW CONTACT & SOCIALS SECTION */}
<div className="border-t border-gray-100 my-4 pt-4 px-4 space-y-4">
  {/* Email */}
  <div className="flex items-center gap-3 text-gray-600">
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
    <span className="text-[11px] break-all font-medium">support@organicstore.com</span>
  </div>
  
  {/* Phone */}
  <div className="flex items-center gap-3 text-gray-600">
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
    <span className="text-sm font-bold text-gray-800">+911169268569</span>
  </div>

  {/* Social Icons Row */}
  <div className="flex items-center justify-between pt-2 text-gray-400">
    {/* Telegram */}
    <a href="#" className="hover:text-[#0088cc]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.441-.168.575-.533.744-.813.763-.62.043-1.09-.423-1.69-.817-.94-.614-1.47-.993-2.381-1.593-1.052-.693-.37-1.074.23-1.69.157-.163 2.884-2.642 2.937-2.864.007-.028.013-.131-.046-.183s-.17-.034-.243-.017c-.103.024-1.742 1.11-4.92 3.253-.466.32-.888.477-1.265.468-.415-.01-.1.214-1.213-.585-.88-.636-1.583-.954-1.583-.954s-.73-.466.015-1.127c.05-.044 1.25-.6 3.6-1.59 2.13-.9 3.55-1.493 4.256-1.778.67-.27 1.393-.314 1.874-.24.106.017.348.077.505.204.128.103.19.236.21.393.024.182.02.502-.007.72z"/></svg></a>
    
    {/* Instagram */}
    <a href="#" className="hover:text-[#e4405f]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
    
    {/* Facebook */}
    <a href="#" className="hover:text-[#1877f2]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
    
    {/* YouTube */}
    <a href="#" className="hover:text-[#ff0000]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
    
    {/* X (Twitter) */}
    <a href="#" className="hover:text-black"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
    
    {/* Location Pin */}
    <a href="#" className="hover:text-olive-green"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></a>
    
    {/* WhatsApp */}
    <a href="#" className="hover:text-[#25d366]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.59-4.819c1.557.921 3.23 1.408 5.24 1.408h.006c5.448 0 9.883-4.437 9.885-9.885.002-5.448-4.435-9.884-9.884-9.884-2.64 0-5.122 1.03-6.988 2.898-1.867 1.869-2.895 4.35-2.897 6.99-.001 2.105.549 4.158 1.588 5.922l-.992 3.626 3.712-.975zm11.367-7.374c-.302-.151-1.785-.882-2.062-.982-.277-.1-.478-.151-.68.151-.202.302-.782.982-.958 1.183-.176.201-.352.226-.654.076-.302-.151-1.274-.47-2.426-1.498-.897-.8-1.502-1.787-1.678-2.088-.176-.302-.019-.465.131-.615.136-.135.302-.352.453-.528.151-.176.201-.302.302-.503.101-.201.05-.377-.025-.528-.075-.151-.68-1.636-.932-2.24-.245-.591-.495-.51-.68-.52-.176-.009-.377-.01-.578-.01-.201 0-.528.075-.805.377-.277.301-1.057 1.031-1.057 2.515 0 1.485 1.082 2.918 1.233 3.119.151.201 2.13 3.253 5.16 4.562.721.311 1.282.497 1.719.637.724.23 1.384.197 1.906.12.581-.086 1.785-.73 2.037-1.435.252-.704.252-1.308.176-1.434-.075-.126-.277-.201-.579-.352z"/></svg></a>
  </div>
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