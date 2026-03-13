import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProductTable = ({ products, onDelete, onUpdateStock }) => {
  const [editingStock, setEditingStock] = useState(null);

  const handleStockUpdate = (productId, currentStock) => {
    const newStock = prompt('Enter new stock quantity:', currentStock);
    if (newStock !== null && !isNaN(newStock)) {
      onUpdateStock(productId, parseInt(newStock));
      setEditingStock(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'in-stock': 'bg-green-100 text-green-800',
      'out-of-stock': 'bg-red-100 text-red-800',
      'low-stock': 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      'in-stock': 'In Stock',
      'out-of-stock': 'Out of Stock',
      'low-stock': 'Low Stock'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <>
      {/* Mobile View - Cards */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover bg-gray-50"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-sm font-medium text-emerald-600">${product.price}</p>
                <div className="flex items-center justify-between mt-2">
                  {getStatusBadge(product.status)}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingStock(product.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit Stock
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Stock: {product.stock}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-50 mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStock === product.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            defaultValue={product.stock}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleStockUpdate(product.id, product.stock);
                              }
                            }}
                            onBlur={() => {
                              const input = e.target;
                              if (input.value !== product.stock.toString()) {
                                onUpdateStock(product.id, parseInt(input.value));
                              }
                              setEditingStock(null);
                            }}
                          />
                          <button
                            onClick={() => setEditingStock(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{product.stock}</span>
                          <button
                            onClick={() => setEditingStock(product.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleStockUpdate(product.id, product.stock)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Stock"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTable;
