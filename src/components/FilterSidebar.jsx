import React, { useState } from 'react';

const FilterSidebar = ({ categories = [], activeCategory, activeSubcategory, onCategoryChange, onSubcategoryChange }) => {
  const [expandedL1, setExpandedL1] = useState(null);
  const [expandedL2, setExpandedL2] = useState(null);

  const toggleL1 = (id) => setExpandedL1(expandedL1 === id ? null : id);
  const toggleL2 = (e, id) => {
    e.stopPropagation();
    setExpandedL2(expandedL2 === id ? null : id);
  };

  return (
    <div className="hidden md:block w-60 lg:w-64 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 sticky top-4 max-h-[calc(100vh-40px)] overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-5 px-1">
        <h3 className="text-base font-black text-gray-800 tracking-tight">Filters</h3>
        <button 
          onClick={() => { onCategoryChange('all'); onSubcategoryChange(''); }}
          className="text-[10px] font-bold text-gray-400 hover:text-purple-600 uppercase tracking-widest transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => onCategoryChange('all')}
          className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 ${
            activeCategory === 'all' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span>🛒</span> All Products
        </button>

        {categories.map((cat) => (
          <div key={cat.id} className="border-b border-gray-50 pb-1">
            <button 
              onClick={() => toggleL1(cat.id)}
              className={`w-full flex justify-between items-center px-2 py-2 text-left transition-all group ${
                expandedL1 === cat.id ? 'text-purple-700' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="text-[13px] font-bold leading-tight flex-1 pr-2">
                {cat.name}
              </span>
              <svg 
                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${expandedL1 === cat.id ? 'rotate-180 text-purple-600' : 'text-gray-300'}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedL1 === cat.id && (
              <div className="mt-1 ml-3 border-l-2 border-purple-100 pl-3 space-y-1 mb-2">
                {cat.subcategories?.map(sub => (
                  <div key={sub.id}>
                    <button 
                      onClick={(e) => {
                        if (sub.items) toggleL2(e, sub.id);
                        else onSubcategoryChange(sub.name);
                      }}
                      className={`w-full flex justify-between items-center py-1.5 text-left text-[12px] font-semibold transition-colors ${
                        expandedL2 === sub.id || activeSubcategory === sub.name ? 'text-purple-600' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                      {sub.items && <span className="text-[10px] opacity-50">{expandedL2 === sub.id ? '▲' : '▼'}</span>}
                    </button>

                    {expandedL2 === sub.id && sub.items && (
                      <div className="mt-1 space-y-1 pl-2">
                        {sub.items.map((item, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => onSubcategoryChange(item)}
                            className={`block w-full text-left py-1 text-[11px] font-medium border-l border-transparent pl-2 ${
                              activeSubcategory === item ? 'text-purple-600 border-purple-600 font-bold' : 'text-gray-400 hover:text-gray-700'
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
    </div>
  );
};

export default FilterSidebar;