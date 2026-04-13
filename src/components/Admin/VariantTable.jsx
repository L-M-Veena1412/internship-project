import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const VariantTable = ({ variants, onDelete }) => {
  const navigate = useNavigate();

  if (!variants || variants.length === 0) {
    return (
      <div className="bg-white p-12 rounded-[2rem] border border-gray-100 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
        No variants found.
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-5">Product Variant</th> {/* Updated Header */}
              <th className="px-6 py-5">Manufacturer</th>
              <th className="px-6 py-5">Packaging/Size</th>
              <th className="px-6 py-5">Pricing (₹)</th>
              <th className="px-6 py-5">Stock</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {variants.map((variant, index) => (
              <motion.tr 
                key={variant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gray-50/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                      <img 
                        src={variant.image} 
                        alt="" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=Org'; }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{variant.productName}</p>
                      {/* SKU Line removed from here */}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">{variant.manufacturerName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-black text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded-md">
                    {variant.weight} {variant.unit} • {variant.packaging}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-900">₹{variant.price}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Wholesale: ₹{variant.wholesalePrice}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${variant.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    <span className="text-xs font-black text-gray-700">{variant.stock} Units</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-5 text-[10px] font-black uppercase tracking-tighter">
                    <button 
                      onClick={() => navigate(`/admin/variants/detail/${variant.id}`)}
                      className="text-gray-400 hover:text-[#708A28] transition-colors"
                    >
                      VIEW
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/variants/edit/${variant.id}`)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={() => onDelete(variant.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
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
  );
};

export default VariantTable;