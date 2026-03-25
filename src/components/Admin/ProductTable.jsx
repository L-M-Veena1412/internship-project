import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProducts } from '../../data/mockData';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { useToast } from '../../context/ToastContext'; // Import Toast hook

const ProductTable = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // States for UI Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const { showToast } = useToast(); // Hook to trigger notifications

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      setProducts(products.filter(p => p.id !== productId));
      showToast(`${productName} removed from inventory`, 'success');
    }
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
    ));
    setIsEditModalOpen(false);
    setProductToEdit(null);
    showToast(`${updatedProduct.name} updated successfully!`, 'success');
  };

  const handleToggleFeatured = (productId, productName, isFeatured) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, featured: !p.featured } : p
    ));
    const status = !isFeatured ? 'featured' : 'regular';
    showToast(`${productName} is now marked as ${status}`, 'success');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Logic to handle adding a new product from the modal
  const handleAddProduct = (newProductData) => {
    const newProduct = {
      ...newProductData,
      id: products.length + 1,
      rating: 0,
      reviews: 0,
      featured: false,
      originalPrice: newProductData.price // Default original price to current price
    };
    
    setProducts([newProduct, ...products]);
    setIsModalOpen(false);
    showToast(`${newProduct.name} added successfully!`, 'success');
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    if (stock > 50) return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
    if (stock > 10) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    return { text: 'Critical', color: 'text-red-600 bg-red-100' };
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory</h2>
              <p className="text-sm text-gray-500">Manage your store products and stock levels</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-olive-green text-white rounded-lg hover:bg-dark-green transition-all shadow-md active:scale-95 font-bold"
            >
              + Add New Product
            </button>
          </div>
          
          {/* Filters Section */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent outline-none text-sm transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent outline-none text-sm bg-gray-50"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop View Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Product Details</th>
                <th className="px-6 py-4 text-left font-semibold">Category</th>
                <th className="px-6 py-4 text-left font-semibold">Pricing</th>
                <th className="px-6 py-4 text-left font-semibold">Stock Level</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-lg object-cover shadow-sm border border-gray-100"
                        src={product.image}
                        alt={product.name}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=Org'}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-400">ID: #{product.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700">{product.stock} units</span>
                      <span className={`mt-1 inline-block w-fit px-2 py-0.5 text-[10px] font-bold rounded uppercase ${getStockStatus(product.stock).color}`}>
                        {getStockStatus(product.stock).text}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleFeatured(product.id, product.name, product.featured)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${
                        product.featured 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}
                    >
                      {product.featured ? '⭐ Featured' : 'Regular'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                      <button onClick={() => handleDelete(product.id, product.name)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="lg:hidden p-4 space-y-4 bg-gray-50">
          {paginatedProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex gap-4">
                <img className="h-20 w-20 rounded-lg object-cover" src={product.image} alt="" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase font-bold">
                      {product.category}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${getStockStatus(product.stock).color}`}>
                      {getStockStatus(product.stock).text}
                    </span>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-xl font-black text-olive-green">${product.price.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(product.id, product.name)} className="p-2 bg-red-50 text-red-600 rounded-lg">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500">Try changing your search or category filters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500 hidden sm:block">
              Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to <span className="font-bold text-gray-900">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span>
            </p>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded text-sm font-bold transition-all ${
                    currentPage === i + 1 ? 'bg-olive-green text-white' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* The Add Product Modal */}
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddProduct={handleAddProduct}
      />

      {/* The Edit Product Modal */}
      <EditProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setProductToEdit(null);
        }} 
        onEditProduct={handleEditProduct}
        productToEdit={productToEdit}
      />
    </>
  );
};

export default ProductTable;