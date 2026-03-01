import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { getProducts, getCategories } from '../services/api';
import Button from '../components/Button';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: '',
    sortBy: 'name'
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Parse category filter to extract category and subcategory
        let categoryFilter = filters.category;
        let subcategoryFilter = undefined;
        
        if (filters.category && filters.category.includes('/')) {
          const [category, subcategory] = filters.category.split('/');
          categoryFilter = category;
          subcategoryFilter = subcategory;
        }
        
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts({
            category: categoryFilter || undefined,
            subcategory: subcategoryFilter,
            search: searchTerm || undefined,
            featured: searchParams.get('featured') === 'true'
          }),
          getCategories()
        ]);
        
        let filteredProducts = productsRes.data;
        
        // Apply price filter
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-').map(Number);
          filteredProducts = filteredProducts.filter(product => {
            if (max) {
              return product.price >= min && product.price <= max;
            }
            return product.price >= min;
          });
        }
        
        // Apply sorting
        filteredProducts.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'rating':
              return b.rating - a.rating;
            case 'name':
            default:
              return a.name.localeCompare(b.name);
          }
        });
        
        setProducts(filteredProducts);
        setCategories(categoriesRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching shop data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters, searchTerm, searchParams]);
  
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (searchTerm) params.set('search', searchTerm);
    if (searchParams.get('featured') === 'true') params.set('featured', 'true');
    
    setSearchParams(params.toString());
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    setSearchTerm(searchValue);
    
    // Update URL params immediately
    const params = new URLSearchParams();
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    } else {
      params.delete('search');
    }
    if (filters.category) params.set('category', filters.category);
    if (searchParams.get('featured') === 'true') params.set('featured', 'true');
    
    setSearchParams(params.toString());
  };
  
  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      sortBy: 'name'
    });
    setSearchTerm('');
    setSearchParams('');
  };
  
  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under $5', value: '0-5' },
    { label: '$5 - $10', value: '5-10' },
    { label: '$10 - $20', value: '10-20' },
    { label: 'Over $20', value: '20-' }
  ];
  
  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Price (Low to High)', value: 'price-low' },
    { label: 'Price (High to Low)', value: 'price-high' },
    { label: 'Highest Rated', value: 'rating' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-dark-text mb-4">Shop</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                name="search"
                placeholder="Search for products..."
                defaultValue={searchTerm}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green"
              />
              <Button type="submit" variant="primary">
                Search
              </Button>
            </div>
          </form>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            className="lg:w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white p-6 rounded-custom shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-dark-text">Filters</h2>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Clear All
                </Button>
              </div>
              
              {/* Categories */}
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
                    <span className="text-sm">All Categories</span>
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
                        <span className="text-sm font-medium">{category.name}</span>
                      </label>
                      {category.subcategories && (
                        <div className="ml-4 mt-1 space-y-1">
                          {category.subcategories.map((sub) => (
                            <label key={sub.id} className="flex items-center text-xs text-gray-600">
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
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-dark-text mb-3">Price Range</h3>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green text-sm"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort By */}
              <div>
                <h3 className="font-medium text-dark-text mb-3">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.aside>
          
          {/* Products */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {loading ? 'Loading...' : 
                 products.length === 0 ? 'No products found' : `${products.length} products found`
                }
              </p>
              
              {/* Mobile Sort */}
              <div className="lg:hidden">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Product Grid */}
            <ProductGrid products={products} loading={loading} error={error} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
