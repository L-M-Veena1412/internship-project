import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatPriceINR } from '../../utils/currency';

const OrderTable = ({ orders, onStatusChange }) => {
  const navigate = useNavigate();

  const statusOptions = [
    "Ordered", "Processing", "Out for Delivery", "Delivered", "Order Cancelled", "Cancelled by Admin"
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-700';
      case 'Order Cancelled': 
      case 'Cancelled by Admin': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* FIX: Added 'overflow-x-auto' to allow swiping on mobile. 
          Removed 'table-fixed' so columns can adapt their size. 
      */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full"> 
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order</th>
              <th className="px-2 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
              {/* HIDDEN ON MOBILE: Items, Payment, Courier */}
              <th className="hidden sm:table-cell px-2 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Items</th>
              <th className="hidden md:table-cell px-2 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Payment</th>
              <th className="hidden lg:table-cell px-2 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Courier</th>
              <th className="px-2 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Amount</th>
              <th className="px-2 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <motion.tr 
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-xs font-black text-gray-800">#{order.id}</p>
                  <p className="text-[9px] font-bold text-gray-400">{order.date}</p>
                </td>

                <td className="px-2 py-3">
                  <p className="text-xs font-black text-gray-800 truncate uppercase max-w-[100px] md:max-w-none">{order.customer}</p>
                  <p className="text-[9px] font-bold text-gray-400 truncate max-w-[100px] md:max-w-none">{order.email}</p>
                </td>

                <td className="hidden sm:table-cell px-2 py-3 text-center">
                  <span className="text-[10px] font-bold text-gray-600">{order.itemsCount || 1}</span>
                </td>

                <td className="hidden md:table-cell px-2 py-3 text-center">
                  <p className="text-[9px] font-black text-gray-500 uppercase">{order.paymentMethod || 'Online'}</p>
                </td>

                <td className="hidden lg:table-cell px-2 py-3 text-center text-[10px] font-bold text-gray-500">
                  {order.courier || 'N/A'}
                </td>

                <td className="px-2 py-3 text-center text-xs font-black text-gray-900">
                  {formatPriceINR(order.total)}
                </td>

                <td className="px-2 py-3 text-center">
                  <select 
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className={`w-full max-w-[110px] px-1 py-1 rounded-lg text-[8px] font-black uppercase outline-none cursor-pointer appearance-none text-center ${getStatusStyle(order.status)}`}
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option} className="bg-white text-gray-800">{option}</option>
                    ))}
                  </select>
                </td>

                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="whitespace-nowrap px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;