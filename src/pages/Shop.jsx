import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { getProducts, getCategories } from '../services/api';
import { getPriceRangesINR } from '../utils/currency';
import Button from '../components/Button';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const productsRef = useRef(null);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    priceRange: '',
    sortBy: 'name'
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  useEffect(() => {
    const urlCategory = searchParams.get('category') || '';
    const urlSearch = searchParams.get('search') || '';
    const urlSubcategory = searchParams.get('subcategory') || '';
    
    if (urlSubcategory) {
      setFilters(prev => ({
        ...prev,
        category: '',
        subcategory: urlSubcategory
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        category: urlCategory,
        subcategory: ''
      }));
    }
    setSearchTerm(urlSearch);
  }, [searchParams]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let categoryFilter = filters.category;
        let subcategoryFilter = filters.subcategory;
        
        if (filters.category && filters.category.includes('/')) {
          const [category, subcategory] = filters.category.split('/');
          categoryFilter = category;
          subcategoryFilter = subcategory;
        }
        
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts({
            category: categoryFilter || undefined,
            subcategory: subcategoryFilter || undefined,
            search: searchTerm || undefined,
            featured: searchParams.get('featured') === 'true'
          }),
          getCategories()
        ]);
        
        let filteredProducts = productsRes.data;
        
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-').map(Number);
          filteredProducts = filteredProducts.filter(product => {
            if (max) return product.price >= min && product.price <= max;
            return product.price >= min;
          });
        }
        
        filteredProducts.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'rating': return b.rating - a.rating;
            case 'name':
            default: return a.name.localeCompare(b.name);
          }
        });
        
        setProducts(filteredProducts);
        setCategories(categoriesRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, searchTerm, searchParams]);
  
  useEffect(() => {
    const subcategoryFromURL = searchParams.get('subcategory');
    if (subcategoryFromURL && productsRef.current) {
      setTimeout(() => {
        productsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [searchParams]);
  
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (filterType !== 'category' && searchTerm) params.set('search', searchTerm);
    if (searchParams.get('featured') === 'true') params.set('featured', 'true');
    setSearchParams(params.toString());
  };
  
  const clearFilters = () => {
    setFilters({ category: '', priceRange: '', sortBy: 'name' });
    setSearchTerm('');
    setSearchParams('');
  };
  
  const priceRanges = getPriceRangesINR();
  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Price (Low to High)', value: 'price-low' },
    { label: 'Price (High to Low)', value: 'price-high' },
    { label: 'Highest Rated', value: 'rating' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* SHOP HEADER AND SEARCH BAR REMOVED FROM HERE */}
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            className="lg:w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white p-4 sm:p-6 rounded-custom shadow-soft border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-dark-text">Filters</h2>
                <Button variant="ghost" size="small" onClick={clearFilters} className="text-sm">
                  Clear All
                </Button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-dark-text mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mr-2 text-olive-green focus:ring-olive-green"
                    />
                    <span className="text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <div key={category.id} className="ml-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.slug}
                          checked={filters.category === category.slug}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="mr-2 text-olive-green focus:ring-olive-green"
                        />
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      </label>
                      {category.subcategories && (
                        <div className="ml-4 mt-1 space-y-1">
                          {category.subcategories.map((sub) => (
                            <label key={sub.id} className="flex items-center text-xs text-gray-500">
                              <input
                                type="radio"
                                name="category"
                                value={`${category.slug}/${sub.slug}`}
                                checked={filters.category === `${category.slug}/${sub.slug}`}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="mr-2 text-olive-green focus:ring-olive-green"
                              />
                              <span>{sub.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-dark-text mb-3">Price Range</h3>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green text-sm"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <h3 className="font-medium text-dark-text mb-3">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.aside>
          
          {/* Product Grid Section */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-500 text-sm">
                {loading ? 'Loading...' : products.length === 0 ? 'No products found' : `${products.length} products found`}
              </p>
              
              <div className="lg:hidden">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {searchTerm && (
              <div className="mb-6 p-4 bg-olive-green/5 border border-olive-green/10 rounded-lg">
                <p className="text-olive-green text-sm font-medium">
                  Showing results for "{searchTerm}"
                </p>
              </div>
            )}
            
            <div ref={productsRef} id="product-results">
              <ProductGrid products={products} loading={loading} error={error} searchQuery={searchTerm} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Shop;