import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaTruck, FaShieldAlt, FaShoppingCart, FaEnvelope, FaPhone, FaHeadset } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumb */}
        <motion.nav
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-olive-green">Home</Link>
            </li>
            <li>/</li>
            <li className="text-dark-text font-medium">About</li>
          </ol>
        </motion.nav>

        {/* Introduction Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-olive-green/10 rounded-full mb-6"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaLeaf className="text-3xl text-olive-green" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">
              About OrganicStore
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              At OrganicStore, we are dedicated to providing fresh, organic, and natural products 
              that nourish your body and support a healthy lifestyle. Our commitment to quality 
              ensures that every product you purchase meets the highest standards of organic 
              certification and freshness.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <motion.div
                className="bg-white p-6 rounded-custom shadow-soft text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold text-olive-green mb-2">1000+</div>
                <div className="text-gray-600">Organic Products</div>
              </motion.div>
              
              <motion.div
                className="bg-white p-6 rounded-custom shadow-soft text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="text-3xl font-bold text-olive-green mb-2">50K+</div>
                <div className="text-gray-600">Happy Customers</div>
              </motion.div>
              
              <motion.div
                className="bg-white p-6 rounded-custom shadow-soft text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="text-3xl font-bold text-olive-green mb-2">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Our Mission Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-white rounded-custom shadow-soft p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text text-center mb-8">
              Our Mission
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our mission is to make healthy, organic food accessible to everyone while 
                  supporting sustainable farming practices and local farmers. We believe that 
                  good food should be fresh, natural, and free from harmful chemicals.
                </p>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  We work directly with certified organic farms to ensure that every product 
                  meets strict quality standards. From farm to table, we maintain the highest 
                  level of care to preserve the natural goodness and nutritional value of our products.
                </p>
                
                <p className="text-gray-600 leading-relaxed">
                  By choosing OrganicStore, you're not just buying healthy food – you're 
                  supporting a movement towards sustainable agriculture and a healthier planet 
                  for future generations.
                </p>
              </div>
              
              <motion.div
                className="relative h-64 md:h-80 rounded-custom overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1df0cdade?w=600&h=400&fit=crop"
                  alt="Organic farming"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* What We Offer Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-text text-center mb-12">
            What We Offer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Fresh Vegetables',
                description: 'Locally sourced organic vegetables, rich in nutrients and flavor',
                icon: '🥬',
                link: '/category/vegetables'
              },
              {
                name: 'Fresh Fruits',
                description: 'Sweet, juicy organic fruits picked at peak ripeness',
                icon: '🍎',
                link: '/category/fruits'
              },
              {
                name: 'Dairy Products',
                description: 'Fresh organic dairy from grass-fed cows and happy animals',
                icon: '🥛',
                link: '/category/dairy'
              },
              {
                name: 'Bakery Items',
                description: 'Freshly baked organic goods made with wholesome ingredients',
                icon: '🍞',
                link: '/category/bakery'
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-custom shadow-soft hover:shadow-medium transition-all duration-300 text-center group"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-dark-text mb-3">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                
                <Link
                  to={category.link}
                  className="inline-flex items-center text-olive-green hover:text-dark-green font-medium text-sm"
                >
                  Explore Category
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-text text-center mb-12">
            Why Choose Us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '100% Organic Products',
                description: 'All our products are certified organic and free from harmful chemicals',
                icon: <FaShieldAlt className="text-2xl" />
              },
              {
                title: 'Fresh and Quality Food',
                description: 'We ensure maximum freshness and quality in every product we deliver',
                icon: <FaLeaf className="text-2xl" />
              },
              {
                title: 'Easy Shopping Experience',
                description: 'User-friendly platform with simple navigation and secure payments',
                icon: <FaShoppingCart className="text-2xl" />
              },
              {
                title: 'Fast Delivery',
                description: 'Quick and reliable delivery to your doorstep within 24-48 hours',
                icon: <FaTruck className="text-2xl" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-custom shadow-soft hover:shadow-medium transition-all duration-300 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-olive-green/10 rounded-full mx-auto mb-4 text-olive-green">
                  {feature.icon}
                </div>
                
                <h3 className="text-lg font-semibold text-dark-text mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Information Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-olive-green to-dark-green rounded-custom p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Get In Touch
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                  <FaEnvelope className="text-2xl" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-white/90">support@organicstore.com</p>
                <p className="text-white/90 text-sm">info@organicstore.com</p>
              </motion.div>
              
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                  <FaPhone className="text-2xl" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Phone</h3>
                <p className="text-white/90">+91 98765 43210</p>
                <p className="text-white/90 text-sm">Mon–Sat: 9:00 AM – 7:00 PM IST</p>
              </motion.div>
              
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                  <FaHeadset className="text-2xl" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Address</h3>
                <p className="text-white/90">No. 45, 7th Block, 5th Cross</p>
                <p className="text-white/90 text-sm">Koramangala, Bengaluru</p>
                <p className="text-white/90 text-sm">Karnataka – 560095, India</p>
              </motion.div>
            </div>
            
            <div className="text-center mt-12">
              <motion.div
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to="/contact"
                  className="bg-white text-olive-green px-8 py-3 rounded-custom font-semibold hover:bg-cream transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-6">
            Ready to Start Your Organic Journey?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made the switch to healthier, 
            organic living. Browse our wide selection of fresh, natural products today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/shop"
                className="bg-olive-green text-white px-8 py-3 rounded-custom font-semibold hover:bg-dark-green transition-colors duration-300"
              >
                Start Shopping
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Link
                to="/register"
                className="bg-white text-olive-green border-2 border-olive-green px-8 py-3 rounded-custom font-semibold hover:bg-olive-green hover:text-white transition-colors duration-300"
              >
                Create Account
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
