import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MobileBottomNav = () => {
  const { cartItems } = useCart();
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', icon: '🏠', path: '/' },
    { name: 'Shop', icon: '🗂', path: '/shop' },
    { name: 'Search', icon: '🔍', path: '/shop?search=true' },
    { name: 'Cart', icon: '🛒', path: '/cart' }
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-200"
    >
      <div className="max-w-lg mx-auto">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path || 
                          (item.path === '/shop' && location.pathname.startsWith('/shop'));
            
            return (
              <motion.div
                key={item.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="relative"
              >
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-olive-green' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-2xl mb-1"
                  >
                    {item.icon}
                  </motion.div>
                  
                  {/* Cart Badge - Red Notification Bubble */}
                  {item.name === 'Cart' && cartItems.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                    >
                      {cartItems.length > 99 ? '99+' : cartItems.length}
                    </motion.div>
                  )}
                  
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileBottomNav;
