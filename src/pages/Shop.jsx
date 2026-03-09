import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { getProducts, getCategories } from '../services/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mobile filter drawer visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 1. Sync state with URL params
  const activeCategory = searchParams.get('category') || 'all';
  const activeSort = searchParams.get('sort') || 'name-asc';
  const activePrice = searchParams.get('price') || 'all';
  const activeSearch = searchParams.get('search') || ''; // Added search support

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        setError('Could not load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  // 2. Comprehensive Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Filter (Matches name or category)
    if (activeSearch) {
      const term = activeSearch.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term) ||
        p.subcategory.toLowerCase().includes(term)
      );
    }

    // Category Filter - Handle both category and subcategory with case-insensitive comparison
    if (activeCategory !== 'all') {
      result = result.filter(p => {
        const categoryMatch = p.category.toLowerCase() === activeCategory.toLowerCase();
        const subcategoryMatch = p.subcategory.toLowerCase() === activeCategory.toLowerCase();
        return categoryMatch || subcategoryMatch;
      });
    }

    // Price Range Filter
    if (activePrice !== 'all') {
      if (activePrice === 'under-100') {
        result = result.filter(p => p.price < 100);
      } else if (activePrice === '100-500') {
        result = result.filter(p => p.price >= 100 && p.price <= 500);
      } else if (activePrice === 'over-500') {
        result = result.filter(p => p.price > 500);
      }
    }

    // Sorting Logic
    if (activeSort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [products, activeCategory, activeSort, activePrice, activeSearch]);

  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, ...newParams });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 lg:pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* MOBILE HEADER */}
        <div className="md:hidden mb-4">
          <h1 className="text-2xl font-black text-gray-800">
            {activeSearch ? `Results for "${activeSearch}"` : 'Our Shop'}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {filteredProducts.length} organic products found
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <FilterSidebar 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={(cat) => updateParams({ category: cat })}
              priceRange={activePrice}
              onPriceChange={(price) => updateParams({ price })}
              sortBy={activeSort}
              onSortChange={(sort) => updateParams({ sort })}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
            />
          </aside>

          <main className="flex-grow">
            {/* DESKTOP HEADER */}
            <div className="hidden md:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                  {activeSearch ? `Search: ${activeSearch}` : 'Organic Collection'}
                </h1>
                <div className="h-1 w-12 bg-olive-green rounded-full mt-1"></div>
              </div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                Showing {filteredProducts.length} Results
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + activeSort + activePrice + activeSearch}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ProductGrid 
                  products={filteredProducts} 
                  loading={loading} 
                  error={error} 
                  variant="shop" 
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">No products found in this range.</p>
                <button 
                  onClick={() => setSearchParams({})}
                  className="mt-4 text-olive-green font-black text-sm underline"
                >
                  Clear all filters & search
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;