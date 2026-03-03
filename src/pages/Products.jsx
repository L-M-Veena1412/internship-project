import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Products = () => {
  const { subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Products page - subcategory from URL:', subcategory);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        
        console.log('API Response:', response);
        console.log('Products data:', response?.data);
        
        if (response && response.data) {
          // Log product structure to understand data format
          console.log('Sample product structure:', response.data[0]);
          
          // Filter products based on subcategory slug
          const filteredProducts = response.data.filter(product => {
            console.log('Checking product:', product.name, 'against subcategory:', subcategory);
            console.log('Product subcategorySlug:', product.subcategorySlug);
            console.log('Product category:', product.category);
            console.log('Product subcategory:', product.subcategory);
            console.log('Product tags:', product.tags);
            
            // Try multiple matching strategies
            const matches = product.subcategorySlug?.toLowerCase() === subcategory?.toLowerCase() ||
                           product.category?.slug?.toLowerCase() === subcategory?.toLowerCase() ||
                           product.subcategory?.slug?.toLowerCase() === subcategory?.toLowerCase() ||
                           (product.tags && product.tags.some(tag => tag.slug?.toLowerCase() === subcategory?.toLowerCase()));
            
            console.log('Product matches:', matches);
            return matches;
          });
          
          console.log('Filtered products count:', filteredProducts.length);
          setProducts(filteredProducts);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (subcategory) {
      fetchProducts();
    }
  }, [subcategory]);

  const formatSubcategoryName = (slug) => {
    return slug?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-dark-text mb-2">Something went wrong</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-text mb-4">
            {formatSubcategoryName(subcategory)}
          </h1>
          <p className="text-gray-600">
            Discover our selection of {formatSubcategoryName(subcategory)} products
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-dark-text mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              No products available in {formatSubcategoryName(subcategory)} category.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;
