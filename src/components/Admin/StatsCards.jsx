import React from 'react';
import { motion } from 'framer-motion';
import { mockStats } from '../../data/mockData';

const StatsCards = ({ stats }) => {
  // Use provided stats or default to mockStats
  const displayStats = stats || [
    { label: 'Total Sales', value: `$${mockStats.totalSales.toLocaleString()}`, icon: '💰', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: mockStats.totalOrders.toLocaleString(), icon: '🛒', bg: 'bg-blue-50' },
    { label: 'Total Products', value: mockStats.totalProducts.toLocaleString(), icon: '📦', bg: 'bg-orange-50' },
    { label: 'Active Customers', value: mockStats.totalCustomers.toLocaleString(), icon: '👥', bg: 'bg-purple-50' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
    >
      {displayStats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ 
            y: -5, 
            transition: { duration: 0.2 },
            scale: 1.02
          }}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-all duration-300 hover:shadow-md"
        >
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${stat.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
            {stat.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider truncate">
              {stat.label}
            </p>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              {stat.value}
            </h3>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;