// ProductDashboardPage_ModalUse.jsx
import React, { useState } from 'react';

// Import the Modal component YOU provided
import AddProductModal from './AddProductModal';

const ProductDashboardPageModalUse = () => {
    // --- Existing Product State & Data (mocked based on image_0.png) ---
    const initialProducts = [
        { id: 1, name: 'Traditional Mysore Pak', image: 'https://i.imgur.com/8rV6O5i.png', mainCategory: 'Snacks & Traditional Sweets', subCategory: 'Sweets', price: '20,750', quantity: 15, status: 'In Stock' },
        { id: 2, name: 'Ghee Mysore Pak', image: 'https://i.imgur.com/xT0B4C8.png', mainCategory: 'Snacks & Traditional Sweets', subCategory: 'Sweets', price: '26,560', quantity: 8, status: 'Low Stock' },
        { id: 3, name: 'Special Dry Fruit Mysore Pak', image: 'https://i.imgur.com/Kq4jD3d.png', mainCategory: 'Snacks & Traditional Sweets', subCategory: 'Sweets', price: '37,350', quantity: 0, status: 'Out of Stock' },
        { id: 4, name: 'Classic Besan Mysore Pak', image: 'https://i.imgur.com/N6sY8xI.png', mainCategory: 'Snacks & Traditional Sweets', subCategory: 'Sweets', price: '23,240', quantity: 12, status: 'In Stock' },
        { id: 5, name: 'Royal Mysore Pak', image: 'https://i.imgur.com/nS3l7rM.png', mainCategory: 'Snacks & Traditional Sweets', subCategory: 'Sweets', price: '31,540', quantity: 6, status: 'Low Stock' },
    ];
    const [products, setProducts] = useState(initialProducts);

    // --- MODAL STATE MANAGEMENT (Added) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // Track if we are in Edit mode

    const handleOpenAddModal = () => {
        setEditingProduct(null); // Clear editing state for adding new
        setIsModalOpen(true);
    }

    const handleOpenEditModal = (product) => {
        setEditingProduct(product); // Set the product data to edit
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    }

    // This is the onAddProduct handler required by your AddProductModal component
    const handleAddOrEditProductSubmit = (productData) => {
        if (editingProduct) {
            console.log("Editing product (simulated submit):", productData);
            // logic to update your products state array
        } else {
            console.log("Adding new product (simulated submit):", productData);
            // logic to add new product to products state array
        }
        handleCloseModal();
    }


    // --- Other Handlers ---
    const handleDelete = (id) => {
        if (window.confirm("Are you sure?")) {
            setProducts(products.filter(p => p.id !== id));
        }
    }
    const getStatusClass = (status) => {
        switch (status) {
            case 'In Stock': return 'bg-emerald-100 text-emerald-700';
            case 'Low Stock': return 'bg-orange-100 text-orange-700';
            case 'Out of Stock': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    }

    return (
        <div className="p-6 md:p-8 space-y-10">
            {/* Marked Area: WORKING ADD NEW PRODUCT Button */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Product Inventory</h2>
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">Manage your store items</p>
                </div>
                {/* Working "Add New Product" button using onClick to open modal */}
                <button onClick={handleOpenAddModal} className="px-6 py-3.5 bg-emerald-600 text-white text-[11px] font-black uppercase rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2">
                    <span>+</span>
                    ADD NEW PRODUCT
                </button>
            </div>

            {/* PRODUCT TABLE */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-slate-100">
                        <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <th className="px-6 py-5">Product Info</th>
                            <th className="px-6 py-5">Category</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                <td className="px-6 py-5 flex items-center gap-4">
                                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                                    <div><p className="font-bold text-slate-800 uppercase text-xs">{product.name}</p></div>
                                </td>
                                <td className="px-6 py-5 text-emerald-700 font-bold uppercase tracking-wider text-xs">{product.mainCategory}</td>
                                <td className="px-6 py-5"><span className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase ${getStatusClass(product.status)}`}>{product.status}</span></td>
                                <td className="px-6 py-5 space-x-3 text-xs font-bold uppercase tracking-wide">
                                    {/* Action links */}
                                    {/* Working "EDIT" button opens modal with existing data */}
                                    <button onClick={() => handleOpenEditModal(product)} className="text-blue-600 hover:text-blue-800 transition-all">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 transition-all">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Integration of your provided Modal Component --- */}
            <AddProductModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onAddProduct={handleAddOrEditProductSubmit} 
                productData={editingProduct} // I've added a mock prop here to show how you pass data for editing
            />

        </div>
    );
};

export default ProductDashboardPageModalUse;