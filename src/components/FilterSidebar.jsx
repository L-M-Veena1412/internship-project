import React, { useState } from 'react';
import SafeImage from './SafeImage';

const FilterSidebar = ({ 
  categories = [], 
  activeCategory,
  activeSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
  isFilterOpen,
  setIsFilterOpen 
}) => {
  const [activeTab, setActiveTab] = useState('category');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [selectedSubcategory, setSelectedSubcategory] = useState(activeSubcategory);

  // Debug: Log categories to see if they're being passed
  console.log('FilterSidebar categories:', categories);
  console.log('Categories length:', categories?.length);
  console.log('Categories array:', JSON.stringify(categories, null, 2));

  const renderCategoryIcon = (category, className = "w-5 h-5") => {
    // If category is an object with image property, use SafeImage
    if (typeof category === 'object' && category?.image) {
      return (
        <SafeImage
          src={category.image}
          alt={category.name}
          className={`${className} object-cover rounded`}
        />
      );
    }
    
    // If category is a string, find matching category object
    if (typeof category === 'string') {
      const matchedCategory = categories.find(c => c.name === category);
      if (matchedCategory?.image) {
        return (
          <SafeImage
            src={matchedCategory.image}
            alt={matchedCategory.name}
            className={`${className} object-cover rounded`}
          />
        );
      }
    }
    
    // Fallback to emoji if no image found
    const name = typeof category === 'string' ? category : category?.name;
    const n = name?.toLowerCase();
    if (n?.includes('snack') || n?.includes('sweet')) return '🍯';
    if (n?.includes('health') || n?.includes('wellness') || n?.includes('organic')) return '🌿';
    if (n?.includes('pickle') || n?.includes('thokku')) return '🥒';
    if (n?.includes('pooja') || n?.includes('bhandara')) return '🙏';
    if (n?.includes('papad') || n?.includes('sandige')) return '🍘';
    if (n?.includes('pantry') || n?.includes('grocery')) return '🌾';
    if (n?.includes('coastal') || n?.includes('non-veg')) return '🐟';
    if (n?.includes('veg')) return '🥬';
    if (n?.includes('fruit')) return '🍎';
    if (n?.includes('dairy')) return '🥛';
    if (n?.includes('bakery')) return '🍞';
    return '🛒';
  };

  // Helper to handle category clicks safely
  const handleCategoryClick = (cat) => {
    if (typeof cat === 'object') {
      // If it's an object, use name for filtering (not slug)
      onCategoryChange(cat.name);
    } else {
      // If it's a string, check if it matches any category name
      const matchedCategory = categories.find(c => c.name === cat);
      onCategoryChange(matchedCategory ? matchedCategory.name : cat);
    }
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Handle subcategory click with radio button logic
  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    // If clicking the same subcategory, unselect it (toggle behavior)
    if (activeSubcategory === subcategoryName && activeCategory === categoryName) {
      onCategoryChange(categoryName); // Clear subcategory by setting only category
    } else {
      // Select the new subcategory (exclusive selection)
      onCategoryChange(categoryName);
      onSubcategoryChange && onSubcategoryChange(subcategoryName);
    }
  };

  return (
    <>
      {/* --- MOBILE VIEW: Filter Button & Quick Scroll --- */}
      <div className="w-full space-y-4 mb-6 lg:hidden">
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="w-full py-3.5 bg-olive-green text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-olive-green/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter & Sort
        </button>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth lg:hidden">
          <button
            onClick={() => onCategoryChange('all')}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              activeCategory === 'all' ? 'bg-olive-green text-white shadow-md' : 'bg-white border border-gray-100 text-gray-600'
            }`}
          >
            <span>🛒</span>
            All
          </button>
          {categories && categories.length > 0 ? (
            categories.map((cat) => {
              const name = typeof cat === 'object' ? cat.name : cat;
              const slug = typeof cat === 'object' ? cat.slug : cat;
              return (
                <button
                  key={slug}
                  onClick={() => handleCategoryClick(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                    activeCategory === slug ? 'bg-olive-green text-white shadow-md' : 'bg-white border border-gray-100 text-gray-600'
                  }`}
                >
                  <span>{renderCategoryIcon(cat)}</span>
                  {name.replace(/-/g, ' ')}
                </button>
              );
            })
          ) : (
            // Fallback: Show hardcoded categories if data is not available
            [
              { name: 'Snacks & Traditional Sweets', slug: 'snacks-and-traditional-sweets' },
              { name: 'Health, Wellness & Organic', slug: 'health-wellness-and-organic' },
              { name: 'Pickle & Thokku', slug: 'pickle-and-thokku' },
              { name: 'Pooja Bhandara', slug: 'pooja-bhandara' },
              { name: 'Papads & Sandige', slug: 'papads-and-sandige' },
              { name: 'Pantry & Grocery Essentials', slug: 'pantry-and-grocery-essentials' },
              { name: 'Coastal & Non-Veg Specialties', slug: 'coastal-and-non-veg-specialties' }
            ].map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                  activeCategory === cat.slug ? 'bg-olive-green text-white shadow-md' : 'bg-white border border-gray-100 text-gray-600'
                }`}
              >
                <span>{renderCategoryIcon(cat.name)}</span>
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* --- MOBILE DRAWER OVERLAY --- */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden animate-in slide-in-from-bottom duration-300">
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-800 tracking-tight">Filters</h2>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-400 bg-gray-50 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-1/3 bg-gray-50 border-r border-gray-100">
              {[
                { id: 'category', label: 'Category', icon: '📂' },
                { id: 'sort', label: 'Sort', icon: '⚡' },
                { id: 'price', label: 'Price', icon: '💰' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full py-6 px-4 text-left flex flex-col gap-1 transition-all ${
                    activeTab === tab.id ? 'bg-white border-r-4 border-olive-green shadow-sm' : ''
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className={`text-[11px] font-black uppercase tracking-wider ${activeTab === tab.id ? 'text-olive-green' : 'text-gray-400'}`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'sort' && (
                <div className="space-y-6">
                  {[
                    { val: 'name-asc', lab: 'Name (A-Z)' },
                    { val: 'price-low', lab: 'Price (Low to High)' },
                    { val: 'price-high', lab: 'Price (High to Low)' },
                    { val: 'name-desc', lab: 'Name (Z-A)' }
                  ].map((opt) => (
                    <label key={opt.val} className="flex items-center justify-between group cursor-pointer">
                      <span className={`text-sm font-bold ${sortBy === opt.val ? 'text-olive-green' : 'text-gray-600'}`}>{opt.lab}</span>
                      <input 
                        type="radio" name="sort" checked={sortBy === opt.val} 
                        onChange={() => onSortChange(opt.val)} 
                        className="w-5 h-5 accent-olive-green" 
                      />
                    </label>
                  ))}
                </div>
              )}

              {activeTab === 'category' && (
                <div className="space-y-6">
                  {['all', ...categories.map(c => c.slug)].map((catSlug) => {
                    const cat = categories.find(c => c.slug === catSlug);
                    const displayName = catSlug === 'all' ? '🛒 All Categories' : `${renderCategoryIcon(cat?.name || catSlug)} ${cat?.name || catSlug.replace(/-/g, ' ')}`;
                    return (
                      <label key={catSlug} className="flex items-center justify-between group cursor-pointer">
                        <span className={`text-sm font-bold capitalize ${activeCategory === catSlug ? 'text-olive-green' : 'text-gray-600'}`}>
                          {displayName}
                        </span>
                        <input 
                          type="radio" name="cat" checked={activeCategory === catSlug} 
                          onChange={() => handleCategoryClick(catSlug)} 
                          className="w-5 h-5 accent-olive-green" 
                        />
                      </label>
                    );
                  })}
                </div>
              )}

              {activeTab === 'price' && (
                <div className="space-y-6">
                  {[
                    { val: 'all', lab: 'All Prices' },
                    { val: 'under-100', lab: 'Under ₹100' },
                    { val: '100-500', lab: '₹100 - ₹500' },
                    { val: 'over-500', lab: 'Over ₹500' }
                  ].map((p) => (
                    <label key={p.val} className="flex items-center justify-between group cursor-pointer">
                      <span className={`text-sm font-bold ${priceRange === p.val ? 'text-olive-green' : 'text-gray-600'}`}>{p.lab}</span>
                      <input 
                        type="radio" name="price" checked={priceRange === p.val} 
                        onChange={() => onPriceChange(p.val)} 
                        className="w-5 h-5 accent-olive-green" 
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-5 border-t flex gap-4 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => { onCategoryChange('all'); onSortChange('name-asc'); onPriceChange('all'); }}
              className="flex-1 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl text-sm"
            >
              Clear All
            </button>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="flex-1 py-4 bg-olive-green text-white font-black rounded-2xl text-sm shadow-lg shadow-olive-green/20"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:block w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28 h-fit">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-gray-800">Filters</h3>
          <button 
            onClick={() => { onCategoryChange('all'); onSortChange('name-asc'); onPriceChange('all'); }}
            className="text-xs font-bold text-gray-400 hover:text-olive-green"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider">Categories</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  checked={activeCategory === 'all'}
                  onChange={() => onCategoryChange('all')}
                  className="w-4 h-4 accent-olive-green" 
                />
                <span className={`text-sm font-bold ${activeCategory === 'all' ? 'text-olive-green' : 'text-gray-500'} group-hover:text-olive-green transition-colors`}>
                  🛒 All Categories
                </span>
              </label>
              {categories.map((cat) => {
                const name = typeof cat === 'object' ? cat.name : cat;
                const slug = typeof cat === 'object' ? cat.slug : cat;
                const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;
                const isExpanded = expandedCategories.has(cat.id);
                
                return (
                  <div key={slug} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer group flex-1">
                        <input 
                          type="radio" 
                          checked={activeCategory === slug}
                          onChange={() => handleCategoryClick(cat)}
                          className="w-4 h-4 accent-olive-green" 
                        />
                        <span className={`text-sm font-bold capitalize ${activeCategory === slug ? 'text-olive-green' : 'text-gray-500'} group-hover:text-olive-green transition-colors`}>
                          {renderCategoryIcon(cat)} {name.replace(/-/g, ' ')}
                        </span>
                      </label>
                      {hasSubcategories && (
                        <button
                          onClick={() => toggleCategoryExpansion(cat.id)}
                          className="p-1 text-gray-400 hover:text-olive-green transition-colors"
                        >
                          <svg 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Subcategories */}
                    {hasSubcategories && isExpanded && (
                      <div className="ml-8 space-y-2 border-l-2 border-gray-100 pl-4">
                        {cat.subcategories.map((sub) => {
                          const currentParams = new URLSearchParams(window.location.search);
                          const currentCategory = currentParams.get('category');
                          const currentSubcategory = currentParams.get('subcategory');
                          const isSelected = currentSubcategory === sub.name && currentCategory === name;
                          
                          return (
                            <label key={sub.id} className="flex items-center gap-2 cursor-pointer group">
                              <input 
                                type="radio" 
                                name="subcategory"
                                checked={isSelected}
                                className="w-3 h-3 accent-olive-green" 
                                onChange={() => handleSubcategoryClick(name, sub.name)}
                              />
                              <span className={`text-xs ${isSelected ? 'text-olive-green font-bold' : 'text-gray-600'} group-hover:text-olive-green transition-colors`}>
                                {sub.name}
                              </span>
                              <span className="text-xs text-gray-400">({sub.count})</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black text-gray-800 mb-3 uppercase tracking-wider">Price Range</h4>
            <select 
              value={priceRange}
              onChange={(e) => onPriceChange(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 outline-none focus:border-olive-green"
            >
              <option value="all">All Prices</option>
              <option value="under-100">Under ₹100</option>
              <option value="100-500">₹100 - ₹500</option>
              <option value="over-500">Over ₹500</option>
            </select>
          </div>

          <div>
            <h4 className="text-sm font-black text-gray-800 mb-3 uppercase tracking-wider">Sort By</h4>
            <select 
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 outline-none focus:border-olive-green"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;