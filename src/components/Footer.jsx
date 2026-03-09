import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    alert('Subscribed successfully!');
    setEmail('');
    setSubscribed(true);
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
    ]
  };
  
  return (
    <footer className="bg-dark-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* 1. Brand Section */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 mb-3">
             <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
             </svg>
             <span className="text-xl font-bold">OrganicStore</span>
          </div>
          <p className="text-green-100 text-xs sm:text-sm max-w-sm">
            Bringing fresh, organic produce directly from our farms to your table.
          </p>
        </div>

        {/* 2. 3-Column Link Grid (Side-by-Side) */}
        <div className="grid grid-cols-3 gap-x-2 sm:gap-8 mb-16 border-b border-green-700/30 pb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h3 className="text-[11px] sm:text-base font-bold mb-4 uppercase tracking-wider text-green-200">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-green-100 hover:text-white transition-colors text-[10px] sm:text-sm block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 3. Social Icons (Now ABOVE Stay Updated) */}
        <div className="flex justify-center items-center gap-6 mb-8">
          {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
            <a
              key={social}
              href={`https://${social}.com`}
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/5"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Using Colorful Icons from your reference image */}
              <img 
                src={`https://cdn-icons-png.flaticon.com/512/733/${social === 'facebook' ? '733547' : social === 'instagram' ? '733558' : social === 'twitter' ? '733579' : '733646'}.png`}
                className="w-6 h-6" // Removed 'invert' to keep the colors like your image
                alt={social}
              />
            </a>
          ))}
        </div>
        
        {/* 4. Newsletter Section (Stay Updated) */}
        <div className="flex flex-col items-center text-center mb-12">
          <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
          <p className="text-green-100 text-sm mb-6">Subscribe for exclusive offers.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
            <input 
              type="email" 
              placeholder="Enter email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="px-4 py-3 rounded-lg text-black bg-white focus:outline-none flex-1 shadow-inner" 
              required 
            />
            <button type="submit" className="px-8 py-3 bg-olive-green text-white rounded-lg font-bold hover:bg-green-700 transition-colors">
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* 5. Copyright Bottom */}
        <div className="pt-8 border-t border-green-700/50 text-center text-green-100/60 text-[10px] sm:text-xs">
          <p>&copy; {currentYear} OrganicStore. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;