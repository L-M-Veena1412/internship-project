import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCategories } from '../data/mockData';
import { useAuth } from '../context/AuthContext'; // IMPORTED AUTH

const MobileNavigation = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState('main');
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth(); // ACCESS AUTH STATE

  const resetNav = () => {
    setCurrentView('main');
    setSelectedCat(null);
    setSelectedSub(null);
  };

  const handleSubClick = (sub) => {
    if (sub.items && sub.items.length > 0) {
      setSelectedSub(sub);
      setCurrentView('leaf');
    } else {
      navigate(`/shop?category=${encodeURIComponent(selectedCat.name)}&subcategory=${encodeURIComponent(sub.name)}`);
      onClose();
      setTimeout(resetNav, 300);
    }
  };

  const handleLeafClick = (item) => {
    navigate(`/shop?category=${encodeURIComponent(selectedCat.name)}&subcategory=${encodeURIComponent(item)}`);
    onClose();
    setTimeout(resetNav, 300);
  };

  const slideVariants = {
    enter: { x: '100%', opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[1000]" onClick={onClose} />
      )}

      <div className={`fixed top-0 left-0 h-full w-[80%] bg-white z-[1001] shadow-2xl transition-transform duration-300 flex flex-col no-scrollbar ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* --- TOP SECTION: ACCOUNT LOGIC (Matches Image 2 & 3) --- */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between mb-4">
             {/* User Icon Circle */}
             <div className="w-10 h-10 bg-[#708A28] rounded-full flex items-center justify-center text-white shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
             </div>
             {/* Close Button */}
             <button onClick={onClose} className="p-1.5 bg-white rounded-full shadow-sm border border-gray-100">
               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          {!isLoggedIn ? (
            // LOGGED OUT VIEW (Second Image)
            <div className="space-y-0.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Welcome Guest</p>
              <Link to="/login" onClick={onClose} className="text-[15px] font-black text-gray-800 uppercase flex items-center gap-1.5 group">
                Account / Login <span className="text-[#708A28] transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          ) : (
            // LOGGED IN VIEW (Third Image)
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Welcome back,</p>
                <h3 className="text-lg font-black text-gray-800 tracking-tight uppercase truncate leading-tight">{user?.name || 'User'}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Link to="/orders" onClick={onClose} className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-[#708A28] hover:border-[#708A28]/20 transition-all">
                   📦 Orders
                </Link>
                <Link to="/wishlist" onClick={onClose} className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-red-500 hover:border-red-100 transition-all">
                   ❤️ Wishlist
                </Link>
              </div>

              <button onClick={() => { logout(); onClose(); }} className="w-full py-2 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition-colors">
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* --- NAVIGATION LINKS --- */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {currentView === 'main' && (
              <motion.div key="main" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="px-4 py-2">
                <Link to="/" onClick={onClose} className="block text-[#708A28] text-[14px] font-black py-3 border-b border-gray-50 uppercase tracking-widest">Home</Link>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest pt-4 pb-1 px-1">Categories</p>
                
                {mockCategories?.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => {
                      setSelectedCat(cat);
                      if (cat.subcategories && cat.subcategories.length > 0) {
                        setCurrentView('sub');
                      } else {
                        navigate(`/shop?category=${encodeURIComponent(cat.name)}`);
                        onClose();
                      }
                    }} 
                    className="w-full text-left py-3 px-1 flex justify-between items-center border-b border-gray-50 group"
                  >
                    <span className="text-[13px] text-gray-700 font-bold uppercase tracking-tight group-active:text-[#708A28]">{cat.name}</span>
                    <span className="text-gray-300 text-xs font-black">→</span>
                  </button>
                ))}
              </motion.div>
            )}

            {currentView === 'sub' && (
              <motion.div key="sub" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="px-4 py-2">
                <button onClick={() => setCurrentView('main')} className="text-[#708A28] mb-4 text-[10px] font-black flex items-center gap-1 uppercase tracking-widest bg-[#708A28]/10 px-3 py-1.5 rounded-lg mt-2">← BACK TO MENU</button>
                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">{selectedCat?.name}</h2>
                
                {selectedCat?.subcategories?.map(sub => (
                  <button key={sub.id} onClick={() => handleSubClick(sub)} className="w-full text-left py-3 px-1 border-b border-gray-50 flex justify-between items-center group">
                    <span className="text-gray-700 font-bold text-[13px] uppercase tracking-tight">{sub.name}</span>
                    <span className="text-[#708A28]/30 text-xs">→</span>
                  </button>
                ))}
              </motion.div>
            )}

            {currentView === 'leaf' && (
              <motion.div key="leaf" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="px-4 py-2">
                <button onClick={() => setCurrentView('sub')} className="text-[#708A28] mb-4 text-[10px] font-black flex items-center gap-1 uppercase tracking-widest bg-[#708A28]/10 px-3 py-1.5 rounded-lg mt-2">← BACK</button>
                <h2 className="text-[12px] font-black text-[#708A28] mb-3 px-1 border-l-4 border-[#708A28] pl-3 uppercase tracking-tight">{selectedSub?.name}</h2>
                
                {selectedSub?.items?.map((item, idx) => (
                  <button key={idx} onClick={() => handleLeafClick(item)} className="w-full text-left py-3 px-1 border-b border-gray-50 text-[12px] font-bold text-gray-600 hover:text-[#708A28] uppercase tracking-tight">
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- BOTTOM CONTACT SECTION --- */}
        <div className="px-5 py-6 space-y-4 border-t border-gray-50 bg-gray-50/30">
          <div className="space-y-2">
            <a href="mailto:support@mangalorecart.zohodesk.in" className="flex items-center gap-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              <span className="truncate">support@mangalorecart.zohodesk.in</span>
            </a>
            <a href="tel:+911169268569" className="flex items-center gap-2.5 text-[12px] font-black text-gray-800">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
              <span>+91 11692 68569</span>
            </a>
          </div>

          {/* Social Links Icons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {[
              "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.876c-.181 1.905-.959 6.492-1.35 8.571-.166.883-.492 1.179-.806 1.207-.691.064-1.215-.456-1.885-.894-1.048-.686-1.64-1.113-2.658-1.783-1.177-.775-.415-1.2.257-1.899.176-.183 3.232-2.963 3.291-3.213.007-.033.014-.154-.059-.219s-.181-.042-.259-.025c-.11.023-1.865 1.183-5.26 3.473-.497.341-.948.508-1.353.499-.446-.01-1.303-.252-1.94-.459-.781-.253-1.402-.389-1.348-.82.028-.225.338-.456.93-.694 3.633-1.583 6.055-2.628 7.265-3.133 3.456-1.445 4.174-1.696 4.642-1.705.103-.002.333.023.483.145s.202.316.222.443z",
              "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
              "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
              "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
              "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
              "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
              "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.942-.001-3.841-.487-5.538-1.409l-6.459 1.717zm11.833-20.091c-4.517 0-8.196 3.68-8.198 8.197 0 1.548.438 3.058 1.267 4.368l.1 1.159-4.665 1.274 1.296-4.735-.114-.183c-.853-1.362-1.303-2.937-1.302-4.557.002-4.516 3.682-8.196 8.2-8.196 2.19 0 4.248.853 5.795 2.403 1.547 1.55 2.4 3.607 2.4 5.797-.002 4.517-3.682 8.197-8.2 8.197-1.402 0-2.774-.356-3.97-1.03l-.284-.16-3.753.985.998-3.655-.175-.279c-.742-1.182-1.134-2.547-1.133-3.948.002-4.14 3.366-7.505 7.505-7.505 2.012 0 3.894.782 5.31 2.198 1.417 1.416 2.198 3.3 2.197 5.31-.003 4.142-3.369 7.506-7.507 7.506z"
            ].map((path, i) => (
              <div key={i} className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#708A28] transition-colors shrink-0 shadow-sm">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={path} /></svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;