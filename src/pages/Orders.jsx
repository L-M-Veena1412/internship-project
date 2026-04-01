import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPriceINR } from '../utils/currency';
import { getMyOrders } from '../services/api';
import Button from '../components/Button';

const Orders = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        const latestOrder = response.data?.[0];

        if (latestOrder) {
          setOrder({
            orderId: `ORD${latestOrder.id}`,
            orderDate: new Date(latestOrder.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            paymentStatus: latestOrder.payment_status,
            totalAmount: Number(latestOrder.total_amount),
            status: latestOrder.status || 'Placed Successfully',
            items: (latestOrder.items || []).map((item) => ({
              name: item.product_name,
              image: item.product_image,
              price: Number(item.unit_price),
              quantity: Number(item.quantity),
              category: item.category || 'Organic Product',
            })),
          });
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fetching your orders...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fdfbf4] flex items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-md bg-white p-10 rounded-3xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="mb-6 text-gray-200 text-6xl">📦</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">No Orders Found</h2>
          <p className="text-gray-500 text-sm font-medium mb-8">
            Looks like you haven't tasted our organic specialties yet. Start your journey today!
          </p>
          <Link to="/shop">
            <Button variant="primary" className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf4] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <p className="text-purple-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Confirmation</p>
              <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Order Details</h1>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{order.status}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Order Info */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Items Ordered</h3>
                  <p className="text-[10px] font-black text-gray-800">{order.items.length} Products</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item, index) => (
                    <div key={index} className="p-6 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-2xl border border-gray-100 shadow-sm flex-shrink-0"
                        onError={handleImageError}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest mb-0.5">{item.category}</p>
                        <h4 className="text-sm font-black text-gray-800 uppercase truncate">{item.name}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-xs font-bold text-gray-400">Qty: <span className="text-gray-900">{item.quantity}</span></p>
                          <p className="text-xs font-bold text-gray-400">Price: <span className="text-gray-900">{formatPriceINR(item.price)}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900">{formatPriceINR(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Trust Badges */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                   <p className="text-[8px] font-black text-gray-300 uppercase mb-1">Quality</p>
                   <p className="text-[10px] font-bold text-gray-700 leading-tight">Taste Guaranteed</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                   <p className="text-[8px] font-black text-gray-300 uppercase mb-1">Safety</p>
                   <p className="text-[10px] font-bold text-gray-700 leading-tight">Damage Covered</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                   <p className="text-[8px] font-black text-gray-300 uppercase mb-1">Shipping</p>
                   <p className="text-[10px] font-bold text-gray-700 leading-tight">Fresh Delivery</p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-6">
              <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 border-b border-gray-50 pb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Order ID</span>
                    <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Date</span>
                    <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">{order.orderDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Payment</span>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">{order.paymentStatus}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-6">
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPriceINR(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-900 uppercase">Total</span>
                    <span className="text-xl font-black text-gray-900">{formatPriceINR(order.totalAmount)}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full py-3 rounded-xl font-black uppercase tracking-widest text-[9px] border-2"
                  onClick={() => window.print()}
                >
                  Print Invoice
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link to="/shop">
                  <Button variant="primary" className="w-full py-4 rounded-3xl shadow-lg shadow-purple-100 font-black uppercase tracking-widest text-[10px]">
                    Continue Shopping
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;