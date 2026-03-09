import React, { useState, useEffect, useRef } from 'react';
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
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [trendingSearches] = useState([
    'organic vegetables',
    'fresh fruits',
    'dairy products',
    'organic honey'
  ]);

  const { getCartItemsCount } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemsCount = getCartItemsCount();

  const saveToHistory = (term) => {
    if (!term.trim()) return;
    const newHistory = [term, ...searchHistory.filter(i => i !== term)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleSelectSearch = (term) => {
    saveToHistory(term);
    // Standardize the search term (remove extra spaces)
    const formattedTerm = term.trim();
    navigate(`/shop?search=${encodeURIComponent(formattedTerm)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

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
    e?.preventDefault();
    if (searchQuery.trim()) {
      handleSelectSearch(searchQuery.trim());
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';
  };
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

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
          
          {/* CONSOLIDATED MOBILE SEARCH OVERLAY */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white z-[999] md:hidden flex flex-col h-screen overflow-hidden"
              >
                <div className="flex items-center p-4 border-b border-gray-100 gap-3">
                  <button onClick={() => setIsSearchOpen(false)} className="p-1">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex-1 relative">
                    <form onSubmit={handleSearchSubmit}>
                      <input 
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for items..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-olive-green"
                      />
                      {searchQuery && (
                        <button 
                          type="button" 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </form>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white">
                  {searchQuery.length === 0 ? (
                    <div className="p-5">
                      {searchHistory.length > 0 && (
                         <div className="mb-8">
                            <div className="flex justify-between mb-4">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent</h3>
                                <button onClick={clearHistory} className="text-[10px] text-olive-green font-bold uppercase">Clear All</button>
                            </div>
                            <div className="space-y-4">
                                {searchHistory.map(term => (
                                    <div key={term} onClick={() => handleSelectSearch(term)} className="flex items-center gap-4 text-gray-600 cursor-pointer">
                                        <span className="text-gray-300">🕒</span>
                                        <span className="text-sm">{term}</span>
                                    </div>
                                ))}
                            </div>
                         </div>
                      )}

                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Trending</h3>
                      <div className="space-y-5">
                        {trendingSearches.map(term => (
                          <div 
                            key={term} 
                            onClick={() => handleSelectSearch(term)} 
                            className="flex items-center gap-4 text-gray-600 cursor-pointer active:bg-gray-50 -mx-2 p-2 rounded-lg"
                          >
                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-sm font-medium">{term}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-6">
                      {searchResults.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => { navigate(`/product/${item.id}`); setIsSearchOpen(false); }} 
                          className="flex items-center gap-4 cursor-pointer"
                        >
                          <img 
                            src={item.image} 
                            className="w-14 h-14 rounded-lg object-cover bg-gray-50 border border-gray-100" 
                            onError={handleImageError} 
                            alt="" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-sm truncate uppercase tracking-tight">{item.name}</p>
                            <p className="text-xs text-gray-400 lowercase">{item.subcategory || item.category}</p>
                          </div>
                          <div className="text-sm font-black text-gray-900 pr-1">
                            ₹{item.price}
                          </div>
                        </div>
                      ))}
                      
                      {searchResults.length === 0 && searchQuery.length > 2 && (
                        <div className="text-center py-10 px-4">
                          <p className="text-gray-400 text-sm">No products found for "{searchQuery}"</p>
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="mt-2 text-olive-green text-xs font-bold underline"
                          >
                            Clear search
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN NAVBAR CONTENT */}
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

              {isLoggedIn ? (
                <div className="relative profile-dropdown">
                  <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="p-2 rounded-lg text-dark-text hover:bg-gray-100 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </button>
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      >
                        <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                        <Link to="/orders" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Orders</Link>
                        <hr className="my-1 border-gray-100" />
                        <button onClick={() => { logout(); setIsProfileDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
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