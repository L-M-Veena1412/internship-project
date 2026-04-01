import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  const [openMenus, setOpenMenus] = useState({
    Orders: false,
    Customer: false,
    Sellers: false,
    Products: false
  });

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      subItems: [{ name: 'List', path: '/admin/orders' }, { name: 'Detail', path: '/admin/orders/detail' }]
    },
    {
      name: 'Products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      // Adding sub-items turns it into a dropdown automatically
      subItems: [
        { name: 'List', path: '/admin/products' },
        { name: 'Add', path: '/admin/products/add' },
        { name: 'Edit', path: '/admin/products/edit' } // You can remove this if you only edit from the list
      ]
    },
    {
      name: 'Customer',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      subItems: [{ name: 'List', path: '/admin/customers' }, { name: 'Detail', path: '/admin/customers/detail' }, { name: 'Add', path: '/admin/customers/add' }]
    },
    {
      name: 'Sellers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      subItems: [{ name: 'List', path: '/admin/sellers' }, { name: 'Add', path: '/admin/sellers/add' }]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    window.location.href = '/admin/login';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
        <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center text-white text-xl">🌱</div>
        <h1 className="text-xl font-black text-emerald-800 tracking-tighter leading-tight">
          Organic<br/><span className="text-emerald-600">Store</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar">
        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Admin Panel</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = openMenus[item.name];
            const isActive = location.pathname === item.path;

            return (
              <li key={item.name} className="mb-1">
                {hasSubItems ? (
                  <>
                    <button onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isExpanded ? 'text-emerald-700 bg-emerald-50/50' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <div className="flex items-center">
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="ml-3 text-sm font-bold">{item.name}</span>
                      </div>
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ml-9 space-y-1 mt-1 overflow-hidden border-l border-emerald-100">
                          {item.subItems.map((sub) => (
                            <li key={sub.name}>
                              <Link to={sub.path} className={`block px-4 py-2 text-sm font-medium transition-all ${location.pathname === sub.path ? 'text-emerald-800 font-bold bg-emerald-100/50' : 'text-gray-500 hover:text-emerald-600'}`}>- {sub.name}</Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link to={item.path} className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="ml-3 text-sm font-bold">{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="ml-3">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`fixed left-0 top-0 h-screen bg-white z-50 transition-transform duration-300 border-r border-gray-100 ${isMobile ? (isOpen ? 'translate-x-0 w-72' : '-translate-x-full') : 'translate-x-0 w-72'}`}>
      <SidebarContent />
    </div>
  );
};

export default AdminSidebar;