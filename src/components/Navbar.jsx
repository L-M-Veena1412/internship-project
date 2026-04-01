import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MobileNavigation from './MobileNavigation';
// IMPORT your mock products
import { mockProducts } from '../data/mockData';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { getCartItemsCount } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemsCount = getCartItemsCount();

  // --- SEARCH LOGIC UPDATED ---
  // This filters your real products as you type
  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6); // Show top 6 matches
  }, [searchQuery]);

  const handleSelectSearch = (productId) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to shop page with search filter
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
  // --- END SEARCH LOGIC ---

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

  // Helper for search UI
  const SearchContent = () => (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {searchQuery.length > 0 ? (
          searchResults.length > 0 ? (
            <>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Products Found</h3>
              {searchResults.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleSelectSearch(item.id)} 
                  className="flex items-center gap-4 cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <img 
                    src={item.image} 
                    className="w-14 h-14 rounded-lg object-cover bg-gray-50 border border-gray-100" 
                    alt="" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate uppercase tracking-tight">{item.name}</p>
                    <p className="text-xs text-gray-400 lowercase">{item.category}</p>
                  </div>
                  <div className="text-sm font-black text-gray-900 pr-1">
                    ₹{item.price}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm font-bold">No products match "{searchQuery}"</p>
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400 text-sm font-medium">Search for sweets, snacks and more...</p>
          </div>
        )}
      </div>
    </div>
  );

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
          
          {/* SEARCH OVERLAY (Universal for Mobile & Desktop) */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white z-[999] flex flex-col h-screen overflow-hidden"
              >
                <div className="flex items-center p-4 border-b border-gray-100 gap-3">
                  <button onClick={() => setIsSearchOpen(false)} className="p-1">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex-1 relative max-w-2xl mx-auto">
                    <form onSubmit={handleSearchSubmit}>
                      <input 
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search our organic store..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                    </form>
                  </div>
                </div>

                <SearchContent />
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN NAVBAR CONTENT */}
          <div className="flex md:grid md:grid-cols-3 items-center justify-between pointer-events-auto">
            <div className="flex items-center justify-start">
              <button className="p-2 rounded-lg text-dark-text md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <Link to="/" className="hidden md:flex items-center space-x-2 text-2xl font-bold text-dark-text tracking-tighter uppercase">
                <span className="text-purple-600">Organic</span>Store
              </Link>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className={`text-[11px] uppercase tracking-widest font-black transition-colors hover:text-purple-600 ${location.pathname === link.path ? 'text-purple-600' : 'text-gray-500'}`}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 sm:space-x-4">
              <button 
                className="p-2 rounded-lg text-dark-text hover:bg-gray-100 transition-colors" 
                onClick={() => setIsSearchOpen(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <Link to="/cart" className="relative p-2 text-dark-text hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {cartItemsCount > 0 && <span className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartItemsCount}</span>}
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
                  <button className="px-5 py-2 rounded-full border border-purple-600 text-purple-600 text-sm font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all">
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