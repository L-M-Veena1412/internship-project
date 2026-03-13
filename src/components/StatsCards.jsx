import React from 'react';
import { motion } from 'framer-motion';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Inventory Value',
      value: `$${stats.inventoryValue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: '💰',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Out of Stock Items',
      value: stats.outOfStockItems,
      change: '+2',
      changeType: 'negative',
      icon: '⚠️',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      textColor: 'text-red-700'
    },
    {
      title: 'New Messages',
      value: stats.newMessages,
      change: '+5',
      changeType: 'positive',
      icon: '💬',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      change: '+8',
      changeType: 'positive',
      icon: '📦',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`${card.bgColor} rounded-xl p-6 border border-gray-200`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              card.changeType === 'positive' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {card.change}
            </span>
          </div>
          
          <div>
            <h3 className={`text-2xl font-bold ${card.textColor} mb-1`}>
              {card.value}
            </h3>
            <p className="text-sm text-gray-600">{card.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
