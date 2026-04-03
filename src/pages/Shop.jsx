import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { mockProducts, mockCategories } from '../data/mockData';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products] = useState(mockProducts);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const categories = mockCategories;

  const activeCategory = searchParams.get('category') || 'all';
  const activeSubcategory = searchParams.get('subcategory') || '';

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeSubcategory) {
      const targetSub = activeSubcategory.toLowerCase().trim();
      result = result.filter(p => p.subcategory?.toLowerCase().trim() === targetSub);
    } 
    else if (activeCategory !== 'all') {
      const targetCat = activeCategory.toLowerCase().trim();
      result = result.filter(p => p.category?.toLowerCase().trim() === targetCat);
    }
    return result;
  }, [products, activeCategory, activeSubcategory]);

  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, ...newParams });
    // Note: We don't close the drawer here anymore so user can pick multiple if needed, 
    // but typically for categories, you can close it if you want.
  };

  const clearAll = () => {
    setSearchParams({});
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf4] pt-6 lg:pt-8 pb-12 relative">
      
      {/* MOBILE FILTER BUTTON - Professional Floating Style */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-black rounded-full shadow-2xl uppercase tracking-widest text-[11px] shadow-purple-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filter & Sort
        </motion.button>
      </div>

      {/* MOBILE DRAWER - Two-Pane Layout Integration */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[90%] max-w-sm bg-white z-[60] shadow-2xl flex flex-col md:hidden"
            >
              {/* Header */}
              <div className="p-5 border-b flex justify-between items-center bg-white">
                <h2 className="font-black text-lg uppercase tracking-tighter text-gray-800">Refine Results</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-50 rounded-full transition-colors active:bg-gray-200">
                   <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Sidebar Content - Padding removed to allow Sidebar Tabs to touch edges */}
              <div className="flex-1 overflow-hidden">
                <FilterSidebar 
                  isMobile={true}
                  categories={categories}
                  activeCategory={activeCategory}
                  activeSubcategory={activeSubcategory}
                  onCategoryChange={(cat) => updateParams({ category: cat, subcategory: '' })}
                  onSubcategoryChange={(sub) => updateParams({ subcategory: sub })}
                />
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-white border-t flex gap-3">
                <button 
                  onClick={clearAll} 
                  className="flex-1 py-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest bg-gray-50 rounded-xl active:bg-gray-100 transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)} 
                  className="flex-1 py-4 bg-purple-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-purple-100 active:scale-95 transition-transform"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-72 shrink-0">
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <span className="text-4xl mb-4">🔍</span>
                <h3 className="text-gray-800 font-black uppercase tracking-tighter text-center">No matches found</h3>
                <button onClick={clearAll} className="mt-6 px-8 py-3 bg-purple-600 text-white font-black text-[11px] rounded-full uppercase tracking-widest">
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