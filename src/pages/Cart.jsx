import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { convertToINR, formatINR, formatPriceINR } from '../utils/currency';
import Button from '../components/Button';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  // Safety check: Ensure cart is always an array
  const cartItems = cart || [];

  const subtotalInr = cartItems.reduce(
    (total, item) => total + convertToINR(item.price) * item.quantity,
    0
  );

  const freeShippingThresholdInr = 100;
  const minimumSubtotalForFreeInr = freeShippingThresholdInr + 1;
  const shippingCostInr = 49;
  const shippingInr = subtotalInr > freeShippingThresholdInr ? 0 : shippingCostInr;
  const finalTotalInr = subtotalInr + shippingInr;
  
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';
  };
  
  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleCheckoutNavigation = (e) => {
    // Check if e exists before calling preventDefault
    if (e && e.preventDefault) e.preventDefault();
    
    if (!isLoggedIn) {
      // Redirect to login but tell it to come back to checkout
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <motion.div
          className="text-center max-w-md px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-black text-dark-text mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any organic goodies to your cart yet.
          </p>
          
          <Link to="/shop">
            <Button variant="primary" size="large" className="rounded-full px-10">
              Start Shopping
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-dark-text mb-2">Shopping Cart</h1>
            <p className="text-gray-500">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-gray-50 flex-shrink-0"
                        onError={handleImageError}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-dark-text text-lg truncate">
                              {item.name}
                            </h3>
                            <p className="text-olive-green font-bold text-sm">
                              {formatPriceINR(item.price)}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center bg-gray-50 rounded-full p-1">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-olive-green disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >–</button>
                            <span className="px-4 font-bold text-sm text-dark-text">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-olive-green"
                              disabled={item.quantity >= 20}
                            >+</button>
                          </div>
                          
                          <p className="font-black text-dark-text">
                            {formatINR(convertToINR(item.price) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <div className="flex justify-between items-center pt-4">
                <Link to="/shop" className="text-sm font-bold text-olive-green hover:underline">
                  ← Back to Shop
                </Link>
                <button
                  onClick={clearCart}
                  className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors"
                >
                  Clear All Items
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 sticky top-28">
                <h2 className="text-xl font-black text-dark-text mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotalInr)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Delivery</span>
                    <span className={shippingInr === 0 ? 'text-green-500 font-bold' : ''}>
                      {shippingInr === 0 ? 'FREE' : formatINR(shippingInr)}
                    </span>
                  </div>
                  
                  {shippingInr > 0 && (
                    <div className="text-[11px] font-bold text-olive-green bg-green-50 p-3 rounded-xl border border-green-100 leading-tight uppercase tracking-wider text-center">
                      Add {formatINR(Math.max(0, minimumSubtotalForFreeInr - subtotalInr))} more for FREE Delivery!
                    </div>
                  )}
                  
                  <div className="border-t border-dashed border-gray-200 pt-4">
                    <div className="flex justify-between font-black text-dark-text text-2xl">
                      <span>Total</span>
                      <span>{formatINR(finalTotalInr)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Fixed the nested button/link issue here */}
                <Button 
                  onClick={handleCheckoutNavigation} 
                  variant="primary" 
                  size="large" 
                  className="w-full py-4 rounded-2xl shadow-lg shadow-green-100 font-black transition-transform active:scale-95"
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-6 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm9.496 3.502a1 1 0 010 1.415l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L7 10.086l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;