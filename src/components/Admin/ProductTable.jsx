import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatPriceINR } from '../../utils/currency'; 

const ProductTable = ({ products, onDelete, onUpdateStock }) => {
  const [editingStock, setEditingStock] = useState(null);
  const navigate = useNavigate();

  // SAFETY GUARD
  if (!products || !Array.isArray(products)) {
    return (
      <div className="w-full p-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007863] mx-auto mb-4"></div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
          Syncing Inventory...
        </p>
      </div>
    );
  }

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
      {/* --- DESKTOP VIEW --- */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden font-sans">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Product Info</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Pricing</th>
                <th className="px-6 py-5">Inventory</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
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
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-[#007863] uppercase tracking-widest">
                      {product.category || product.mainCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900 text-sm">
                    {formatPriceINR(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    {editingStock === product.id ? (
                      <input
                        type="number"
                        defaultValue={product.stock || product.quantity}
                        className="w-20 px-2 py-1 border-2 border-[#007863]/20 rounded-lg text-xs font-black focus:border-[#007863] outline-none"
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
                        <span className="text-sm font-black text-gray-700">{product.stock || product.quantity} Units</span>
                        <span className="opacity-0 group-hover/stock:opacity-100 text-[#007863] text-xs">✎</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product.stock || product.quantity)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-5 text-[10px] font-black uppercase tracking-tighter">
                      <button 
                        onClick={() => navigate(`/admin/products/detail/${product.id}`)} 
                        className="text-gray-400 hover:text-[#007863] transition-colors"
                      >
                        VIEW
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)} 
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)} 
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => (
          <motion.div 
            key={product.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                <img 
                  src={product.image || "/logo192.png"} 
                  className="w-full h-full object-cover" 
                  alt="" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Org'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-[#007863] uppercase tracking-widest mb-1 truncate">
                  {product.category || product.mainCategory}
                </p>
                <h3 className="text-sm font-black text-gray-800 uppercase leading-tight mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-lg font-black text-gray-900">{formatPriceINR(product.price)}</p>
                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">ID: #{product.id}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  Stock: {product.stock || product.quantity} Units
                </span>
                {getStatusBadge(product.stock || product.quantity)}
              </div>
              <div className="flex gap-3 text-[10px] font-black uppercase tracking-tighter">
                <button 
                   onClick={() => navigate(`/admin/products/detail/${product.id}`)}
                   className="px-3 py-2 bg-gray-50 text-gray-500 rounded-xl"
                >
                  VIEW
                </button>
                <button 
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)} 
                  className="px-3 py-2 bg-[#007863]/10 text-[#007863] rounded-xl"
                >
                  EDIT
                </button>
                <button 
                  onClick={() => onDelete(product.id)} 
                  className="px-3 py-2 bg-red-50 text-red-500 rounded-xl"
                >
                  DELETE
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;