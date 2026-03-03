import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Show success message and clear input
    alert('Subscribed successfully!');
    setEmail('');
    setSubscribed(true);
    
    // Reset subscribed state after 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };
  
  const footerLinks = {
    Shop: [
      { name: 'All Products', path: '/shop' },
      { name: 'Featured', path: '/shop?featured=true' },
      { name: 'New Arrivals', path: '/shop?new=true' },
      { name: 'Best Sellers', path: '/shop?bestsellers=true' }
    ],
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Story', path: '/story' },
      { name: 'Sustainability', path: '/sustainability' },
      { name: 'Blog', path: '/blog' }
    ],
    Support: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Shipping Info', path: '/shipping' },
      { name: 'Returns', path: '/returns' }
    ],
    Connect: [
      { name: 'Facebook', path: 'https://facebook.com' },
      { name: 'Instagram', path: 'https://instagram.com' },
      { name: 'Twitter', path: 'https://twitter.com' },
      { name: 'Newsletter', path: '/newsletter' }
    ]
  };
  
  return (
    <footer className="bg-dark-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <span className="text-lg sm:text-2xl font-bold">OrganicStore</span>
            </div>
            
            <p className="text-green-100 mb-4 sm:mb-6 text-sm sm:text-base max-w-md">
              Bringing fresh, organic produce directly from our farms to your table. 
              Quality you can trust, sustainability you can believe in.
            </p>
            
            <div className="flex space-x-3 sm:space-x-4">
              {['facebook', 'instagram', 'twitter'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>
          
          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{category}</h3>
              <ul className="space-y-1 sm:space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-green-100 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Newsletter */}
        <motion.div
          className="mt-12 pt-8 border-t border-green-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-green-100 text-sm sm:text-base">
                Subscribe to our newsletter for exclusive offers and organic tips.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-lg text-dark-text bg-white focus:outline-none focus:ring-2 focus:ring-olive-green flex-1 md:flex-none w-full"
                required
              />
              <button 
                type="submit"
                className="px-4 sm:px-6 py-2 bg-olive-green text-white rounded-lg hover:bg-dark-green transition-colors font-medium whitespace-nowrap"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </motion.div>
        
        {/* Bottom */}
        <motion.div
          className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-green-700 text-center text-green-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-sm sm:text-base">&copy; {currentYear} OrganicStore. All rights reserved.</p>
          <div className="mt-2 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
