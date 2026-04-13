import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import AdminSidebar from '../../components/Admin/AdminSidebar';
import StatsCards from '../../components/Admin/StatsCards';
import ProductTable from '../../components/Admin/ProductTable';
import OrderTable from '../../components/Admin/OrderTable';
import VariantTable from '../../components/Admin/VariantTable'; // FIXED: Added this import

// Page & View Imports
import CustomerTable from './CustomerTable';
import AddProductPage from './AddProductPage'; 
import ProductDetailView from './ProductDetailView';
import OrderDetailView from './OrderDetailView';
import CustomerForm from './CustomerForm';
import CustomerDetailView from './CustomerDetailView';
import AnalyticsPage from './TempA';
import SettingsPage from './TempS';
import ManufacturerListPage from './ManufacturerListPage';
import ManufacturerForm from './ManufacturerForm';
import ManufacturerDetailView from './ManufacturerDetailView';
import CategoryListPage from './CategoryListPage';
import CategoryForm from './CategoryForm';
import ProductVariantForm from './ProductVariantForm'; 

// Data Imports
import { mockStats, mockOrders, mockProducts, mockCustomers } from '../../data/mockData';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    
    if (!authStatus && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
    
    if (authStatus && (location.pathname === '/admin' || location.pathname === '/admin/')) {
      navigate('/admin/dashboard');
    }
  }, [navigate, location.pathname]);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#708A28] mx-auto"></div>
      </div>
    );
  }

  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full overflow-hidden text-slate-900 font-sans">
      <AdminSidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />

      <div className="flex-1 lg:ml-72 min-w-0 w-full h-screen overflow-y-auto transition-all duration-300 no-scrollbar">
        
        {/* MOBILE HEADER */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-4">
            <button onClick={handleSidebarToggle} className="p-2 bg-slate-50 rounded-xl text-[#708A28] hover:bg-olive-green/10 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-sm font-black text-[#708A28] uppercase tracking-widest">Organic Store</h1>
            <div className="w-10"></div> 
          </div>
        </div>

        <main className="p-3 sm:p-6 lg:p-8 w-full max-w-none mx-0">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* CATEGORY ROUTES */}
              <Route path="categories" element={<CategoryListPage />} />
              <Route path="categories/add" element={<CategoryForm />} />
              <Route path="categories/edit/:id" element={<CategoryForm />} />

              {/* PRODUCT ROUTES */}
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/add" element={<AddProductPage />} />
              <Route path="products/edit/:productId" element={<AddProductPage />} />
              <Route path="products/detail/:productId" element={<ProductDetailView />} />

              {/* VARIANT ROUTES */}
              <Route path="variants" element={<VariantsPage />} />
              <Route path="variants/add" element={<ProductVariantForm />} />
              <Route path="variants/edit/:id" element={<ProductVariantForm />} />
              <Route path="variants/detail/:id" element={<ProductDetailView />} />

              {/* MANUFACTURER ROUTES */}
              <Route path="manufacturers" element={<ManufacturerListPage />} />
              <Route path="manufacturers/add" element={<ManufacturerForm />} />
              <Route path="manufacturers/edit/:id" element={<ManufacturerForm />} />
              <Route path="manufacturers/detail/:id" element={<ManufacturerDetailView />} />

              {/* ORDER ROUTES */}
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:orderId" element={<OrderDetailView />} />
              <Route path="orders/detail" element={<OrderDetailView />} />

              {/* CUSTOMER ROUTES */}
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/add" element={<CustomerForm />} />
              <Route path="customers/edit/:customerId" element={<CustomerForm />} />
              <Route path="customers/detail/:customerId" element={<CustomerDetailView />} />

              {/* GENERAL ROUTES */}
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="/" element={<DashboardOverview />} />
              <Route path="*" element={<DashboardOverview />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS (Defined outside to prevent re-renders) ---

const VariantsPage = () => {
  const navigate = useNavigate();
  // FIXED: Using React.useState because it's outside the main component scope
  const [variants, setVariants] = React.useState([
    {
      id: 1,
      productName: "Traditional Mysore Pak",
      sku: "SK-MP-500G",
      manufacturerName: "Shree Krishna Sweets",
      weight: "500",
      unit: "GM",
      packaging: "Box",
      price: 450,
      wholesalePrice: 400,
      stock: 25,
      image: "https://via.placeholder.com/40"
    }
  ]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-6">
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Product Variants</h2>
          <p className="text-[10px] font-black text-[#708A28] uppercase tracking-widest mt-1">Manufacturer Pricing & Stock Mapping</p>
        </div>
        <button 
          onClick={() => navigate('/admin/variants/add')}
          className="px-6 py-3 bg-[#708A28] text-white text-[10px] font-black uppercase rounded-xl shadow-lg hover:bg-[#5e7421] transition-all"
        >
          Add New Variant
        </button>
      </div>

      <VariantTable variants={variants} onDelete={(id) => console.log("Delete", id)} />
    </motion.div>
  );
};

const DashboardOverview = () => {
  const [recentOrders, setRecentOrders] = useState(mockOrders.slice(0, 5));
  const handleStatusChange = (orderId, newStatus) => {
    setRecentOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6 w-full">
      <StatsCards />
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <div className="px-4 py-4 md:px-6 md:py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-black text-gray-800 uppercase tracking-tighter">Recent Orders</h2>
        </div>
        <OrderTable orders={recentOrders} onStatusChange={handleStatusChange} />
      </div>
    </motion.div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-4 md:space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-[1.5rem] border border-gray-100 shadow-sm">
        <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tighter">Product Inventory</h2>
        <p className="text-[9px] md:text-[10px] font-black text-[#708A28] uppercase tracking-[0.2em] mt-1">Manage items and stock</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 px-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#708A28] outline-none transition-all text-xs font-medium"
          />
        </div>

        <button 
          onClick={() => navigate('/admin/products/add')}
          className="w-full md:w-auto px-6 py-3 bg-[#708A28] hover:bg-[#5E7D22] text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 tracking-widest"
        >
          Add Product
        </button>
      </div>

      <ProductTable 
        products={filteredProducts} 
        onDelete={(id) => setProducts(products.filter(p => p.id !== id))} 
        onUpdateStock={(id, stock) => setProducts(products.map(p => p.id === id ? {...p, stock} : p))} 
      />
    </motion.div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState(mockOrders);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 md:p-6 rounded-3xl border border-gray-100">
        <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tighter">Order List</h2>
      </div>
      <OrderTable orders={orders} onStatusChange={(id, status) => setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o))} />
    </motion.div>
  );
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-4 md:space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tighter">Customer List</h2>
          <p className="text-[9px] md:text-[10px] font-black text-[#708A28] uppercase tracking-[0.2em] mt-1">Managing {customers.length} registered members</p>
        </div>
        <button onClick={() => navigate('/admin/customers/add')} className="w-full sm:w-auto px-6 py-3 bg-[#708A28] text-white text-[10px] font-black uppercase rounded-xl shadow-lg">Add Customer</button>
      </div>
      <CustomerTable customers={customers} onDelete={(id) => setCustomers(customers.filter(c => c.id !== id))} />
    </motion.div>
  );
};

export default AdminDashboard;