import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockProducts } from '../data/mockData';
import Button from './Button';
import SafeImage from './SafeImage';

const HeroSection = () => {
  return (
    <section className="relative h-[60vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src="/images/home/main-hero.jpg"
          alt="Fresh organic produce"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45 md:bg-gradient-to-r md:from-black/50 md:to-black/30" />
      </div>
      
      {/* Content Layer */}
      {/* Reduced pt-24 to pt-16 to save space on small screens */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-4 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Reduced text size to text-3xl and margin to mb-2 */}
          <motion.h1
            className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-2 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Fresh Organic
            <span className="block text-olive-green mt-1">Goodness</span>
          </motion.h1>
          
          {/* Reduced text size to text-xs/sm and margin to mb-4 */}
          <motion.p
            className="text-xs sm:text-sm md:text-xl text-white/90 mb-4 max-w-xs sm:max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the finest organic produce, sustainably sourced and delivered fresh to your doorstep.
          </motion.p>
          
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/shop">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                {/* Compact button for mobile visibility */}
                <Button variant="primary" size="small" className="px-6 py-2 text-sm md:text-base shadow-xl">
                  Shop Now
                  <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;