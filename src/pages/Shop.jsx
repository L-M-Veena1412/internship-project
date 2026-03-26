import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { mockProducts, mockCategories } from '../data/mockData';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products] = useState(mockProducts);
  const categories = mockCategories;

  const activeCategory = searchParams.get('category') || 'all';
  const activeSubcategory = searchParams.get('subcategory') || '';

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeSubcategory) {
      const targetSub = activeSubcategory.toLowerCase().trim();
      result = result.filter(p => 
        p.subcategory?.toLowerCase().trim() === targetSub
      );
    } 
    else if (activeCategory !== 'all') {
      const targetCat = activeCategory.toLowerCase().trim();
      result = result.filter(p => 
        p.category?.toLowerCase().trim() === targetCat
      );
    }

    return result;
  }, [products, activeCategory, activeSubcategory]);

  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, ...newParams });
  };

  const clearAll = () => setSearchParams({});

  return (
    /* UPDATED: Reduced padding-top to remove the circled gap */
    <div className="min-h-screen bg-[#fdfbf4] pt-6 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 shrink-0">
          <FilterSidebar 
            categories={categories}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
            onCategoryChange={(cat) => updateParams({ category: cat, subcategory: '' })}
            onSubcategoryChange={(sub) => updateParams({ subcategory: sub })}
          />
        </aside>

        <main className="flex-grow">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 border-l-4 border-purple-600 pl-4 uppercase tracking-tighter">
              {activeSubcategory || (activeCategory === 'all' ? 'Shop All' : activeCategory)}
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1 ml-5">
              Showing {filteredProducts.length} Results
            </p>
          </div>

          <div className="min-h-[400px]">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100"
              >
                <span className="text-4xl mb-4">🔍</span>
                <h3 className="text-gray-800 font-black uppercase tracking-tighter">No products found</h3>
                <p className="text-gray-400 text-sm font-medium mb-6">Try adjusting your filters</p>
                <button 
                  onClick={clearAll}
                  className="px-6 py-2 bg-purple-600 text-white font-black text-xs rounded-full uppercase tracking-widest hover:bg-purple-700 transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;