import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import TestimonialSection from '../components/TestimonialSection';
import NewsletterSection from '../components/NewsletterSection';
import { getProducts, getCategories, getFeaturedProducts } from '../services/api';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [categoriesRes, featuredRes, productsRes] = await Promise.all([
          getCategories(),
          getFeaturedProducts(),
          getProducts()
        ]);
        
        setCategories(categoriesRes.data);
        setFeaturedProducts(featuredRes.data);
        
        // Simulate best sellers (top rated products)
        const sortedByRating = productsRes.data.sort((a, b) => b.rating - a.rating);
        setBestSellers(sortedByRating.slice(0, 4));
        
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our wide range of organic products, carefully curated for your healthy lifestyle
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hand-picked favorites from our organic collection
            </p>
          </motion.div>
          
          <ProductGrid products={featuredProducts} loading={loading} error={error} />
          
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button variant="primary" size="large">
                View All Products
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Best Sellers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Best Sellers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Customer favorites that keep them coming back for more
            </p>
          </motion.div>
          
          <ProductGrid products={bestSellers} loading={loading} error={error} />
        </div>
      </section>
      
      {/* Brand Story Section */}
      <section className="py-20 bg-olive-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Our Organic Journey
              </h2>
              <div className="space-y-4 text-green-100">
                <p>
                  Founded in 2015, OrganicStore began with a simple mission: to make fresh, 
                  organic produce accessible to everyone. What started as a small family farm 
                  has grown into a trusted source for healthy, sustainable food.
                </p>
                <p>
                  We partner with local farmers who share our commitment to organic farming 
                  practices, ensuring that every product we deliver meets the highest standards 
                  of quality and sustainability.
                </p>
                <p>
                  From our farm to your table, we're dedicated to bringing you the freshest, 
                  most flavorful organic produce while supporting a healthier planet.
                </p>
              </div>
              
              <div className="mt-8">
                <Link to="/about">
                  <Button variant="secondary" size="large" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                    Learn Our Story
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop"
                alt="Organic farm"
                className="rounded-custom shadow-medium"
              />
              
              {/* Stats Overlay */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-6 rounded-custom shadow-medium">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-olive-green">8+</div>
                    <div className="text-sm text-gray-600">Years</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-olive-green">50+</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-olive-green">10k+</div>
                    <div className="text-sm text-gray-600">Customers</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <TestimonialSection />
      
      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

export default Home;
