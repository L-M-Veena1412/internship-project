import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MobileNavigation from './MobileNavigation';
import { getProducts } from '../services/api';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const { getCartItemsCount } = useCart();
  const { isLoggedIn, logout, user } = useAuth(); // Added user to show name if available
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemsCount = getCartItemsCount();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const response = await getProducts({ search: searchQuery });
          if (response && response.data) {
            setSearchResults(response.data.slice(0, 5));
          }
        } catch (error) {
          console.error("Search fetch error:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white z-50 flex items-center px-4"
              >
                <div className="flex flex-col w-full max-w-3xl mx-auto relative">
                  <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 shadow-sm">
                    <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    
                    <form onSubmit={handleSearchSubmit} className="flex-1">
                      <input 
                        type="text"
                        placeholder="Search for organic products..."
                        className="w-full bg-transparent border-none outline-none px-3 py-2 text-sm font-medium text-dark-text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </form>
                  </div>
                  {/* ... Search results mapping (same as before) ... */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex md:grid md:grid-cols-3 items-center justify-between">
            <div className="flex items-center justify-start">
              <button className="p-2 rounded-lg text-dark-text md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <Link to="/" className="hidden md:flex items-center space-x-2 text-2xl font-bold text-dark-text">
                <svg className="w-8 h-8 text-olive-green" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                <span>OrganicStore</span>
              </Link>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className={`text-sm font-semibold transition-colors hover:text-olive-green ${location.pathname === link.path ? 'text-olive-green' : 'text-dark-text'}`}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 sm:space-x-4">
              <button className="p-2 rounded-lg text-dark-text hover:bg-gray-100" onClick={() => setIsSearchOpen(true)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              
              <Link to="/cart" className="relative p-2 text-dark-text hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {cartItemsCount > 0 && <span className="absolute top-0 right-0 bg-olive-green text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartItemsCount}</span>}
              </Link>

              {/* AUTHENTICATION UI - RESTORED */}
              {isLoggedIn ? (
                <div className="relative profile-dropdown">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="p-2 rounded-lg text-dark-text hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-semibold truncate">{user?.email || 'User'}</p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Orders</Link>
                        <hr className="my-1 border-gray-100" />
                        <button 
                          onClick={() => { logout(); setIsProfileDropdownOpen(false); }} 
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="hidden md:block">
                  <button className="px-5 py-2 rounded-full border border-olive-green text-olive-green text-sm font-bold hover:bg-olive-green hover:text-white transition-all">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
      <MobileNavigation isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Navbar;