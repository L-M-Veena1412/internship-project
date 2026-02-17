import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsLoading(false);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };
  
  return (
    <section className="py-20 bg-olive-green">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Stay Fresh, Stay Updated
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Get exclusive offers, new product announcements, and organic living tips delivered to your inbox
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-3 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-white text-olive-green rounded-lg font-semibold hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto"
            >
              <div className="text-white">
                <svg className="w-16 h-16 mx-auto mb-4 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Thank you for subscribing!</h3>
                <p className="text-green-100">
                  Check your email for a confirmation message.
                </p>
              </div>
            </motion.div>
          )}
          
          <p className="text-green-200 text-sm mt-6">
            Join 10,000+ subscribers. Unsubscribe anytime.
          </p>
        </motion.div>
        
        {/* Decorative Elements */}
        <motion.div
          className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, -10, 0] 
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
          animate={{ 
            x: [0, -15, 0], 
            y: [0, 15, 0] 
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>
    </section>
  );
};

export default NewsletterSection;
