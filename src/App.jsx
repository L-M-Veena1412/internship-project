import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { ToastProvider, useToast } from './context/ToastContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import TestProfile from './pages/TestProfile';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// Scroll to top component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-olive-green text-white rounded-full shadow-medium hover:bg-dark-green transition-colors flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

function AppContent() {
  const { toast, hideToast } = useToast();
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-cream">
          {!isAdminRoute && <Navbar />}
          
          <main className={isAdminRoute ? '' : 'pt-16'}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
                <Route path="/products/:subcategory" element={<PageTransition><Products /></PageTransition>} />
                <Route path="/product/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
                <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
                <Route path="/orders" element={<PageTransition><Orders /></PageTransition>} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </main>
          
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <MobileBottomNav />}
          {!isAdminRoute && <ScrollToTop />}
          
          {/* Global Toast Notification */}
          <Toast 
            message={toast.message} 
            isVisible={toast.isVisible} 
            onClose={hideToast} 
          />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
