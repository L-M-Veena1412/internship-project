import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom/client';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
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
    sortBy: 'name',
    activeFilter: ''
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [tempSearch, setTempSearch] = useState('');
  
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

  // Body scroll lock for mobile search overlay
  useEffect(() => {
    if (isMobileSearchOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.bottom = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.bottom = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.bottom = '';
    };
  }, [isMobileSearchOpen]);
  
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

  // Mobile search handlers
  const handleMobileSearchOpen = () => {
    setIsMobileSearchOpen(true);
    setTempSearch(searchTerm);
  };

  const handleMobileSearchClose = () => {
    setIsMobileSearchOpen(false);
    setTempSearch('');
  };

  const handleMobileSearchSubmit = (searchValue) => {
    setSearchTerm(searchValue);
    setIsMobileSearchOpen(false);
    setTempSearch('');
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    setSearchParams(params.toString());
  };

  const handleMobileSearchItemClick = (item) => {
    handleMobileSearchSubmit(item.name || item);
  };

  // Filter products for mobile search preview
  const getFilteredProducts = () => {
    if (!tempSearch.trim()) return [];
    return products.filter(product => 
      product.name.toLowerCase().includes(tempSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(tempSearch.toLowerCase()) ||
      product.subcategory?.toLowerCase().includes(tempSearch.toLowerCase())
    );
  };

  // Trending search suggestions
  const trendingSearches = [
    'organic vegetables',
    'fresh fruits', 
    'organic honey',
    'whole grains',
    'dairy products',
    'herbal teas'
  ];

  // Category icons mapping
  const categoryIcons = {
    'Fruits': '🍎',
    'Vegetables': '🥬',
    'Dairy': '🥛',
    'Grains': '🌾',
    'Herbs': '🌿',
    'Organic': '🌱',
    'Fresh Produce': '🥕',
    'Dairy Products': '🥛',
    'Bakery': '🍞',
    'Beverages': '🥤',
    'Snacks': '🍿',
    'Pantry': '🥫',
    'default': '🛒'
  };

  const getCategoryIcon = (categoryName) => {
    if (categoryIcons[categoryName]) {
      return categoryIcons[categoryName];
    }
    
    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (key.toLowerCase() === lowerName || lowerName.includes(key.toLowerCase())) {
        return icon;
      }
    }
    
    return categoryIcons.default;
  };
  
  const priceRanges = getPriceRangesINR();
  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Price (Low to High)', value: 'price-low' },
    { label: 'Price (High to Low)', value: 'price-high' },
    { label: 'Highest Rated', value: 'rating' }
  ];
  
  return (
    <>
      {/* Mobile Search Overlay - Native App Feel - Render First */}
      {isMobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-[99999] bg-white" onClick={handleMobileSearchClose}>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
                {/* Back Button */}
                <button
                  onClick={handleMobileSearchClose}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" />
                  </svg>
                </button>
                
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search for organic fruits, vegetables..."
                      value={tempSearch}
                      onChange={(e) => setTempSearch(e.target.value)}
                      className="w-full bg-gray-100 border border-gray-200 rounded-full pl-12 pr-12 py-3 text-base focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent"
                      autoFocus
                    />
                    {tempSearch && (
                      <button
                        onClick={() => setTempSearch('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Content */}
              <div className="flex-1 overflow-y-auto bg-white">
                {tempSearch.trim() ? (
                  /* Search Results */
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Results</h3>
                    <div className="space-y-3">
                      {getFilteredProducts().map((product, index) => (
                        <motion.button
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          onClick={() => handleMobileSearchItemClick(product)}
                          className="w-full flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          {/* Product Image (small thumbnail on left) */}
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';
                              }}
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            {/* Product Name (bold, center-top) */}
                            <h4 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">{product.name}</h4>
                            {/* Category Name (e.g., "fresh-vegetables" in gray text below name) */}
                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                          </div>
                          
                          {/* Price (on the far right, formatted with ₹ symbol) */}
                          <div className="flex-shrink-0">
                            <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                          </div>
                        </motion.button>
                      ))}
                      
                      {getFilteredProducts().length === 0 && (
                        <div className="text-center py-12">
                          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <p className="text-gray-500 text-lg">No products found</p>
                          <p className="text-gray-400 text-sm mt-2">Try searching for different keywords</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* TRENDING State */
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">TRENDING</h3>
                    <div className="space-y-2">
                      {trendingSearches.map((term, index) => (
                        <motion.button
                          key={term}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          onClick={() => handleMobileSearchItemClick(term)}
                          className="w-full flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          {/* Small search icon next to each */}
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-gray-700">{term}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Mobile Filter Button Only */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="w-full py-3 bg-olive-green text-white rounded-lg font-medium hover:bg-dark-green transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v4a1 1 0 011 1H3a1 1 0 01-1z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Filter
          </button>
        </div>

        {/* Mobile Category Chips - Fixed Below Navbar */}
        <div className="lg:hidden mb-6">
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex space-x-2" style={{ minWidth: 'max-content' }}>
              {/* All Categories Chip */}
              <button
                onClick={() => handleFilterChange('category', '')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  filters.category === '' 
                    ? 'bg-olive-green text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              
              {/* Category Chips */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange('category', category.slug)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                    filters.category === category.slug 
                      ? 'bg-olive-green text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">{getCategoryIcon(category.name)}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal - WhatsApp Style Split Pane */}
        {isFilterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsFilterModalOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle Bar */}
              <div className="flex justify-center py-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              
              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Pane - Filter Types */}
                <div className="w-1/2 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="font-semibold text-dark-text mb-4 text-sm">Filters</h3>
                    
                    {/* Sort Filter Type */}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, activeFilter: 'sort' }))}
                      className={`w-full text-left p-3 rounded-lg transition-colors mb-2 ${
                        filters.activeFilter === 'sort' 
                          ? 'bg-white border border-gray-300 shadow-sm' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m0 0l4-4" />
                          </svg>
                          <span className="text-sm font-medium">Sort</span>
                        </div>
                        {filters.sortBy && (
                          <span className="text-xs bg-olive-green text-white px-2 py-1 rounded-full">1</span>
                        )}
                      </div>
                    </button>
                    
                    {/* Category Filter Type */}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, activeFilter: 'category' }))}
                      className={`w-full text-left p-3 rounded-lg transition-colors mb-2 ${
                        filters.activeFilter === 'category' 
                          ? 'bg-white border border-gray-300 shadow-sm' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          <span className="text-sm font-medium">Category</span>
                        </div>
                        {filters.category && (
                          <span className="text-xs bg-olive-green text-white px-2 py-1 rounded-full">1</span>
                        )}
                      </div>
                    </button>
                    
                    {/* Price Filter Type */}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, activeFilter: 'price' }))}
                      className={`w-full text-left p-3 rounded-lg transition-colors mb-2 ${
                        filters.activeFilter === 'price' 
                          ? 'bg-white border border-gray-300 shadow-sm' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">Price</span>
                        </div>
                        {filters.priceRange && (
                          <span className="text-xs bg-olive-green text-white px-2 py-1 rounded-full">1</span>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Right Pane - Filter Options */}
                <div className="w-1/2 bg-white overflow-y-auto">
                  <div className="p-4">
                    {/* Sort Options */}
                    {(filters.activeFilter === 'sort' || (!filters.activeFilter && filters.sortBy)) && (
                      <div>
                        <h4 className="text-sm font-semibold text-dark-text mb-3">Sort By</h4>
                        <div className="space-y-2">
                          {sortOptions.map((option) => (
                            <label key={option.value} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                              <input
                                type="radio"
                                name="mobile-sort"
                                value={option.value}
                                checked={filters.sortBy === option.value}
                                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                className="mr-3 text-olive-green focus:ring-olive-green"
                              />
                              <span className="text-sm text-gray-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Category Options */}
                    {(filters.activeFilter === 'category' || (!filters.activeFilter && filters.category)) && (
                      <div>
                        <h4 className="text-sm font-semibold text-dark-text mb-3">Category</h4>
                        <div className="space-y-2">
                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                              type="radio"
                              name="mobile-category"
                              value=""
                              checked={filters.category === ''}
                              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                              className="mr-3 text-olive-green focus:ring-olive-green"
                            />
                            <span className="text-sm text-gray-700">All Categories</span>
                          </label>
                          {categories.map((category) => (
                            <label key={category.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                              <input
                                type="radio"
                                name="mobile-category"
                                value={category.slug}
                                checked={filters.category === category.slug}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                className="mr-3 text-olive-green focus:ring-olive-green"
                              />
                              <span className="text-sm text-gray-700">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Price Range Options */}
                    {(filters.activeFilter === 'price' || (!filters.activeFilter && filters.priceRange)) && (
                      <div>
                        <h4 className="text-sm font-semibold text-dark-text mb-3">Price Range</h4>
                        <div className="space-y-2">
                          {priceRanges.map((range) => (
                            <label key={range.value} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                              <input
                                type="radio"
                                name="mobile-price"
                                value={range.value}
                                checked={filters.priceRange === range.value}
                                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                                className="mr-3 text-olive-green focus:ring-olive-green"
                              />
                              <span className="text-sm text-gray-700">{range.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sticky Bottom Bar */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      clearFilters();
                      setIsFilterModalOpen(false);
                    }}
                    className="flex-1 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="flex-1 py-3 bg-olive-green text-white hover:bg-dark-green rounded-lg text-sm font-medium transition-colors"
                  >
                    Show {products.length} Products
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Main Layout - Desktop Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sticky Sidebar */}
          <motion.aside
            className="hidden lg:block lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-24 lg:h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white p-6 rounded-custom shadow-soft border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-dark-text">Filters</h2>
                <Button variant="ghost" size="small" onClick={clearFilters} className="text-sm">
                  Clear All
                </Button>
              </div>
              
              {/* Category Filters */}
              <div className="mb-6">
                <h3 className="font-medium text-dark-text mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mr-3 text-olive-green focus:ring-olive-green"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-base">🛒</span>
                      <span className="text-sm font-medium text-gray-700">All Categories</span>
                    </div>
                  </label>
                  
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="category"
                        value={category.slug}
                        checked={filters.category === category.slug}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-3 text-olive-green focus:ring-olive-green"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-base">{getCategoryIcon(category.name)}</span>
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
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
              
              {/* Sort Options */}
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
          
          {/* Main Content Area */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-500 text-sm">
                {loading ? 'Loading...' : products.length === 0 ? 'No products found' : `${products.length} products found`}
              </p>
              
              {/* Mobile Sort Dropdown */}
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
            
            {/* Search Term Display */}
            {searchTerm && (
              <div className="mb-6 p-4 bg-olive-green/5 border border-olive-green/10 rounded-lg">
                <p className="text-olive-green text-sm font-medium">
                  Showing results for "{searchTerm}"
                </p>
              </div>
            )}
            
            {/* Product Grid - Responsive */}
            <div ref={productsRef} id="product-results">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-gray-200 rounded-custom animate-pulse h-80"></div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Shop;