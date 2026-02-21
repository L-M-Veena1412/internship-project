import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategories, getProducts } from '../services/api';
import ProductGrid from '../components/ProductGrid';
import SubcategoryCard from '../components/SubcategoryCard';
import Button from '../components/Button';

const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [categoriesRes] = await Promise.all([
          getCategories()
        ]);
        
        const allCategories = categoriesRes.data;
        const foundCategory = allCategories.find(cat => cat.slug === categorySlug);
        
        if (!foundCategory) {
          setError('Category not found');
          return;
        }
        
        setCategory(foundCategory);
        
        // If subcategorySlug is provided, find the subcategory and load products
        if (subcategorySlug) {
          const foundSubcategory = foundCategory.subcategories?.find(
            sub => sub.slug === subcategorySlug
          );
          
          if (foundSubcategory) {
            setSelectedSubcategory(foundSubcategory);
            
            // Load products for this specific subcategory
            const productsRes = await getProducts({
              category: categorySlug,
              subcategory: subcategorySlug
            });
            setProducts(productsRes.data);
          } else {
            setError('Subcategory not found');
          }
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load category. Please try again later.');
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categorySlug, subcategorySlug]);
  
  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
    setProducts([]);
  };
  
  if (loading && !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-olive-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-text mb-4">{error}</h2>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Category not found</h2>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <li className="text-dark-text font-medium">{category.name}</li>
          </ol>
        </motion.nav>
        
        {/* Category Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-custom shadow-soft overflow-hidden">
            <div className="relative h-48">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
                  <p className="text-lg opacity-90">{category.description}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Subcategories */}
        {!selectedSubcategory && category.subcategories && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-dark-text mb-8">Choose Subcategory</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {category.subcategories.map((subcategory, index) => (
                <SubcategoryCard
                  key={subcategory.id}
                  subcategory={subcategory}
                  categorySlug={categorySlug}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Products (when subcategory is selected) */}
        {selectedSubcategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-dark-text">
                  {selectedSubcategory.name}
                </h2>
                <p className="text-gray-600">
                  Products in {selectedSubcategory.name.toLowerCase()}
                </p>
              </div>
              
              <Button
                variant="outline"
                onClick={handleBackToSubcategories}
              >
                ← Back to Subcategories
              </Button>
            </div>
            
            <ProductGrid products={products} loading={loading} error={error} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
