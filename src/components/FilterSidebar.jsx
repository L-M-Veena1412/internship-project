import React, { useState } from 'react';

const FilterSidebar = ({ 
  categories = [], 
  activeCategory, 
  activeSubcategory, 
  onCategoryChange, 
  onSubcategoryChange,
  isMobile = false 
}) => {
  const [mobileTab, setMobileTab] = useState('category');
  
  // Track deep expanded states independently to mimic image_4.png behavior
  const [expandedL1, setExpandedL1] = useState(null); // Level 1 Category (e.g., Snacks)
  const [expandedL2, setExpandedL2] = useState(null); // Level 2 Subcategory (e.g., Traditional Sweets)

  // Handlers to toggle sections by ID
  const toggleL1 = (id) => setExpandedL1(expandedL1 === id ? null : id);
  const toggleL2 = (e, id) => {
    e.stopPropagation(); // Prevent Level 1 from closing
    setExpandedL2(expandedL2 === id ? null : id);
  };

  // --- MOBILE TWO-PANE LAYOUT ---
  if (isMobile) {
    return (
      <div className="flex h-full bg-white overflow-hidden">
        {/* Left Sidebar Tabs (Category, Sort, Price) */}
        <div className="w-[32%] bg-gray-50 border-r border-gray-100 h-full flex flex-col pt-2">
          {['category', 'sort', 'price'].map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`py-6 px-4 text-[10px] font-bold uppercase tracking-widest text-left border-b border-gray-100 transition-all ${
                mobileTab === tab ? 'bg-white text-purple-700 border-l-4 border-l-purple-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'category' ? 'Categories' : tab === 'sort' ? 'Sort By' : 'Price'}
            </button>
          ))}
        </div>

        {/* Right Deep Hierarchy Options */}
        <div className="w-[68%] overflow-y-auto h-full bg-white custom-scrollbar p-3">
          {mobileTab === 'category' && (
            <div className="space-y-3">
              {/* All Products button */}
              <button 
                onClick={() => { onCategoryChange('all'); onSubcategoryChange(''); }}
                className={`w-full text-left p-3 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-2 ${
                  activeCategory === 'all' && !activeSubcategory
                    ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm' 
                    : 'border-gray-100 text-gray-500 bg-gray-50/30 hover:border-gray-200'
                }`}
              >
                🛒 All Products
              </button>

              <div className="h-[1px] bg-gray-100 my-1" />

              {/* LEVEL 1: Main Category Accordions (RETAINED DEEP NESTING) */}
              {categories.map((cat) => (
                <div key={cat.id} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                  <button 
                    onClick={() => toggleL1(cat.id)}
                    className={`w-full flex justify-between items-center p-4 text-left transition-colors ${
                      expandedL1 === cat.id ? 'bg-purple-50/50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-tight leading-tight">{cat.name}</span>
                    <svg className={`w-3 h-3 text-purple-400 transition-transform duration-300 ${expandedL1 === cat.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {/* LEVEL 2 Subcategory Content */}
                  {expandedL1 === cat.id && cat.subcategories && (
                    <div className="bg-white/50 space-y-1.5 p-2 custom-scrollbar">
                      {cat.subcategories.map(sub => (
                        <div key={sub.id} className="rounded-lg overflow-hidden border border-gray-50">
                          <button 
                            onClick={(e) => {
                              // Replicating original logic: Items trigger toggle, Names trigger selection
                              if (sub.items) toggleL2(e, sub.id); 
                              else onSubcategoryChange(sub.name); 
                            }}
                            className={`w-full flex justify-between items-center px-4 py-3 text-left transition-colors ${
                              expandedL2 === sub.id || activeSubcategory === sub.name
                                ? 'bg-gray-50 text-purple-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-[11px] font-bold leading-tight flex-1 pr-2">{sub.name}</span>
                            {/* Original icon behavior maintained for depth indicator */}
                            {sub.items && (
                              <span className={`text-[10px] text-purple-400 transition-transform ${expandedL2 === sub.id ? 'rotate-180' : ''}`}>▼</span>
                            )}
                          </button>

                          {/* LEVEL 3 Items Content */}
                          {expandedL2 === sub.id && sub.items && (
                            <div className="bg-gray-50 p-2 grid grid-cols-1 gap-1">
                              {sub.items.map((item, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => onSubcategoryChange(item)}
                                  className={`text-left px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                                    activeSubcategory === item 
                                      ? 'bg-white text-purple-600 shadow-sm border border-purple-100 font-extrabold' 
                                      : 'text-gray-400 hover:bg-white'
                                  }`}
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {mobileTab === 'sort' && <SortPlaceholder />}
          {mobileTab === 'price' && <PricePlaceholder />}
        </div>
      </div>
    );
  }

  // --- DESKTOP VIEW (REMAINS DEEP NESTED) ---
  return (
    <div className="w-64 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 sticky top-4 max-h-[calc(100vh-40px)] overflow-y-auto no-scrollbar">
      <h3 className="text-base font-black text-gray-800 mb-5 uppercase tracking-tighter">Filters</h3>
      <div className="space-y-3">
        <button 
          onClick={() => { onCategoryChange('all'); onSubcategoryChange(''); }}
          className={`w-full text-left px-4 py-3 rounded-2xl text-[13px] font-bold transition-all flex items-center gap-2 ${
            activeCategory === 'all' && !activeSubcategory ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          🛒 All Products
        </button>

        {categories.map((cat) => (
          <div key={cat.id} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
            <button onClick={() => toggleL1(cat.id)} className={`w-full flex justify-between items-center p-4 text-left transition-colors ${expandedL1 === cat.id ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'}`}>
              <span className="text-[12px] font-black uppercase tracking-tight">{cat.name}</span>
              <svg className={`w-3 h-3 text-purple-400 transition-transform duration-300 ${expandedL1 === cat.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {expandedL1 === cat.id && cat.subcategories && (
              <div className="bg-gray-50/50 space-y-1.5 p-2">
                {cat.subcategories.map(sub => (
                  <div key={sub.id} className="rounded-lg overflow-hidden border border-gray-50 bg-white">
                    <button onClick={(e) => { if (sub.items) toggleL2(e, sub.id); else onSubcategoryChange(sub.name); }} className={`w-full flex justify-between items-center px-4 py-3 text-left transition-colors ${expandedL2 === sub.id || activeSubcategory === sub.name ? 'text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <span className="text-[12px] font-bold leading-tight flex-1 pr-2">{sub.name}</span>
                      {sub.items && <span className={`text-[10px] text-purple-400 ${expandedL2 === sub.id ? 'rotate-180' : ''}`}>▼</span>}
                    </button>
                    {expandedL2 === sub.id && sub.items && (
                      <div className="bg-gray-50 p-2 space-y-1">
                        {sub.items.map((item, idx) => (
                          <button key={idx} onClick={() => onSubcategoryChange(item)} className={`block w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold ${activeSubcategory === item ? 'bg-white text-purple-600' : 'text-gray-400 hover:bg-white'}`}>{item}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SortPlaceholder = () => (
    <div className="p-4 space-y-3">
        {['Price: Low to High', 'Price: High to Low', 'Newest First', 'Popularity'].map((opt) => (
            <button key={opt} className="w-full text-left p-4 rounded-xl text-[11px] font-bold text-gray-600 border border-gray-100 bg-gray-50/30 active:bg-purple-50">{opt}</button>
        ))}
    </div>
);

const PricePlaceholder = () => (
    <div className="p-4 space-y-3">
        {['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹5000', 'Over ₹5000'].map((opt) => (
            <label key={opt} className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
                <input type="radio" name="price" className="w-4 h-4 accent-purple-600" />
                <span className="text-[11px] font-bold text-gray-600">{opt}</span>
            </label>
        ))}
    </div>
);

export default FilterSidebar;