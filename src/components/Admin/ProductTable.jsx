import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Correct path to match your folder structure
import { formatPriceINR } from '../../utils/currency'; 

const ProductTable = ({ products, onDelete, onUpdateStock }) => {
  const [editingStock, setEditingStock] = useState(null);

  // 🛡️ SAFETY GUARD: If products is undefined or not an array, show a loading message
  if (!products || !Array.isArray(products)) {
    return (
      <div className="w-full p-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
          Syncing Inventory...
        </p>
      </div>
    );
  }

  const handleStockUpdate = (productId, currentStock) => {
    const newStock = prompt('Enter new stock quantity:', currentStock);
    if (newStock !== null && !isNaN(newStock)) {
      onUpdateStock(productId, parseInt(newStock));
      setEditingStock(null);
    }
  };

  const getStatusBadge = (stock) => {
    let style = "bg-green-100 text-green-700";
    let label = "In Stock";

    if (stock === 0) {
      style = "bg-red-100 text-red-700";
      label = "Out of Stock";
    } else if (stock < 10) {
      style = "bg-amber-100 text-amber-700";
      label = "Low Stock";
    }

    return (
      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${style}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Desktop View Table */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Info</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product, index) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                        <img 
                          src={product.image || "/logo192.png"} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=Org'; }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{product.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">ID: #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-gray-900">{formatPriceINR(product.price)}</p>
                  </td>
                  <td className="px-6 py-4">
                    {editingStock === product.id ? (
                      <input
                        type="number"
                        defaultValue={product.stock}
                        className="w-20 px-2 py-1 border-2 border-emerald-100 rounded-lg text-xs font-black focus:border-emerald-500 outline-none"
                        autoFocus
                        onBlur={(e) => {
                          onUpdateStock(product.id, parseInt(e.target.value));
                          setEditingStock(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onUpdateStock(product.id, parseInt(e.target.value));
                            setEditingStock(null);
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center gap-2 group/stock cursor-pointer" onClick={() => setEditingStock(product.id)}>
                        <span className="text-sm font-black text-gray-700">{product.stock} Units</span>
                        <span className="opacity-0 group-hover/stock:opacity-100 text-blue-400 text-xs">✎</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product.stock)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleStockUpdate(product.id, product.stock)} className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 tracking-widest transition-colors">Edit</button>
                      <button onClick={() => onDelete(product.id)} className="text-[10px] font-black uppercase text-red-500 hover:text-red-700 tracking-widest transition-colors">Delete</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View Cards */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex gap-4 mb-4">
              <img src={product.image} className="w-20 h-20 rounded-2xl object-cover bg-gray-50 border border-gray-100" alt="" />
              <div className="flex-1">
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">{product.category}</p>
                <h3 className="text-sm font-black text-gray-800 uppercase leading-tight mb-1">{product.name}</h3>
                <p className="text-lg font-black text-gray-900">{formatPriceINR(product.price)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Stock: {product.stock} Units</span>
                {getStatusBadge(product.stock)}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleStockUpdate(product.id, product.stock)} className="px-4 py-2 bg-gray-50 text-[9px] font-black uppercase rounded-xl hover:bg-gray-100 transition-colors">Stock</button>
                <button onClick={() => onDelete(product.id)} className="px-4 py-2 bg-red-50 text-red-500 text-[9px] font-black uppercase rounded-xl hover:bg-red-100 transition-colors">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;