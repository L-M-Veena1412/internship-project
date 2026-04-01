import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import AdminSidebar from '../../components/Admin/AdminSidebar';
import StatsCards from '../../components/Admin/StatsCards';
import ProductTable from '../../components/Admin/ProductTable';
import OrderTable from '../../components/Admin/OrderTable';

// Page Imports
import AddProductPage from './AddProductPage'; 

// Data Imports
import { mockStats, mockOrders, mockProducts } from '../../data/mockData';

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full overflow-hidden text-slate-900">
      <AdminSidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />

      <div className="flex-1 lg:ml-72 min-w-0 w-full h-screen overflow-y-auto transition-all duration-300">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={handleSidebarToggle} className="p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-emerald-800 uppercase tracking-tighter">Organic Store</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-none mx-0">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/add" element={<AddProductPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:orderId" element={<OrderDetailView />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<DashboardOverview />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- INTERNAL PAGE COMPONENTS ---

const DashboardOverview = () => {
  const [recentOrders, setRecentOrders] = useState(mockOrders.slice(0, 5));
  const handleStatusChange = (orderId, newStatus) => {
    setRecentOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-full">
      <StatsCards />
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Recent Orders</h2>
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

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleUpdateStock = (id, newStock) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-6">
      {/* 1. Page Title Section */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Product Inventory</h2>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">Manage your store items and stock levels</p>
      </div>

      {/* 2. Action Bar (Search & Add Button) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 px-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm font-medium"
          />
        </div>

        <button 
          onClick={() => navigate('/admin/products/add')}
          className="w-full md:w-auto px-6 py-3 bg-[#5E7D63] hover:bg-[#4a634e] text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 tracking-widest"
        >
          <span className="text-lg leading-none">+</span>
          Add New Product
        </button>
      </div>

      {/* 3. Product Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <ProductTable 
          products={filteredProducts} 
          onDelete={handleDelete} 
          onUpdateStock={handleUpdateStock} 
        />
      </div>
    </motion.div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState(mockOrders);
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Order List</h2>
        <button className="px-6 py-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-700 transition-all shadow-lg">Export CSV</button>
      </div>
      <OrderTable orders={orders} onStatusChange={handleStatusChange} />
    </motion.div>
  );
};

const OrderDetailView = () => {
  const { orderId } = useParams();
  const order = mockOrders.find(o => o.id.toString() === orderId) || mockOrders[0];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <h2 className="text-2xl font-black text-gray-800 uppercase">Order Detailed: #{order.id}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">Customer Profile</h3>
            <p className="text-lg font-black text-gray-800 uppercase">{order.customer}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CustomersPage = () => (
  <div className="bg-white rounded-3xl p-20 text-center text-gray-300 font-black uppercase border border-gray-100">User Database Coming Soon</div>
);

const AnalyticsPage = () => (
  <div className="bg-white rounded-3xl p-20 text-center text-gray-300 font-black uppercase border border-gray-100">Sales Insights Coming Soon</div>
);

const SettingsPage = () => (
  <div className="bg-white rounded-3xl p-20 text-center text-gray-300 font-black uppercase border border-gray-100">Portal Settings Coming Soon</div>
);

export default AdminDashboard;