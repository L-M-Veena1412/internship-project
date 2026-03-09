import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import TestimonialSection from '../components/TestimonialSection';
import NewsletterSection from '../components/NewsletterSection';
import Button from '../components/Button';
import { getProducts, getCategories, getFeaturedProducts } from '../services/api';

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
        
        const sortedByRating = [...productsRes.data].sort((a, b) => b.rating - a.rating);
        setBestSellers(sortedByRating.slice(0, 8));
        
        setError(null);
      } catch (err) {
        setError('Failed to load data.');
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      
      <CategoryGrid categories={categories} />
      
      {/* Featured Products Section - Swipe text removed */}
      <section className="py-12 bg-cream/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-dark-text mb-3">
              Featured Products
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">
              Hand-picked favorites from our organic collection.
            </p>
          </motion.div>
          
          <ProductGrid 
            products={featuredProducts} 
            loading={loading} 
            error={error} 
            isSwipeable={true}
          />
        </div>
      </section>
      
      {/* Best Sellers Section - Swipe text removed */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-dark-text">Best Sellers</h2>
              <div className="h-1 w-12 bg-olive-green mt-2 rounded-full"></div>
            </div>
            
            <Link to="/shop" className="group flex items-center gap-2 text-olive-green font-bold text-sm">
              Explore All 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <ProductGrid 
            products={bestSellers} 
            loading={loading} 
            error={error} 
            isSwipeable={true} 
          />
        </div>
      </section>
      
      <section className="py-24 bg-olive-green text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-green-200 text-xs font-bold tracking-widest uppercase mb-6">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                Grown with Love, <br />
                <span className="text-green-300">Rooted in Nature.</span>
              </h2>
              <div className="space-y-6 text-green-50/80 text-lg leading-relaxed">
                <p>
                  OrganicStore began with a simple mission: to make fresh, 
                  organic produce accessible to everyone.
                </p>
              </div>
              
              <div className="mt-10">
                <Link to="/about">
                  <Button variant="secondary" className="bg-white text-olive-green hover:bg-green-50 border-none px-8 py-4 font-bold shadow-xl">
                    Discover More
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop"
                  alt="Organic farm"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <TestimonialSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;