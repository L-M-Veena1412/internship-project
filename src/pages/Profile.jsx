import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  // Tabs State
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isEditing, setIsEditing] = useState(false);

  // Helper: Extract name from email if name is missing
  const getInitialName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'Valued Customer';
  };

  const [newName, setNewName] = useState('');

  useEffect(() => {
    setNewName(getInitialName());
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleSave = async () => {
    const result = await updateProfile({ name: newName, phone: user?.phone || null });
    if (result.success) {
      setIsEditing(false);
    }
  };

  const tabs = ['Personal Info', 'Addresses', 'Order History'];

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Section: Mobile Responsive */}
          <div className="bg-olive-green/5 p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-24 h-24 bg-olive-green text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg border-4 border-white">
              {newName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 capitalize">
                {newName}
              </h2>
              <p className="text-olive-green font-semibold mt-1">Member since 2026</p>
            </div>
          </div>

          {/* Tab Navigation: Swipeable on Mobile */}
          <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar bg-white sticky top-0 z-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[140px] py-5 px-4 text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-olive-green border-b-4 border-olive-green bg-olive-green/5' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="p-6 sm:p-10 min-h-[400px]">
            
            {/* 1. PERSONAL INFO */}
            {activeTab === 'Personal Info' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input 
                          type="text" 
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="flex-1 p-4 border-2 border-olive-green/20 rounded-2xl focus:border-olive-green focus:ring-4 focus:ring-olive-green/10 outline-none transition-all font-medium"
                          autoFocus
                        />
                        <button onClick={handleSave} className="bg-olive-green text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95">Save</button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-2xl group hover:border-olive-green/30 transition-colors">
                        <span className="font-bold text-gray-800 text-lg">{newName}</span>
                        <button onClick={() => setIsEditing(true)} className="text-olive-green font-black text-xs uppercase hover:bg-olive-green hover:text-white px-4 py-2 rounded-xl transition-all">Edit</button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                    <div className="p-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 font-medium italic overflow-hidden text-ellipsis">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <button className="text-sm text-olive-green font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                  Change Password <span className="text-lg">→</span>
                </button>
              </div>
            )}

            {/* 2. ADDRESSES (Frontend Mockup) */}
            {activeTab === 'Addresses' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Delivery Addresses</h3>
                  <button className="bg-olive-green text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-dark-green transition-all">+ Add New</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="border-2 border-gray-100 rounded-2xl p-6 bg-white flex justify-between items-start hover:border-olive-green/20 transition-all shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-olive-green/10 text-olive-green text-[10px] font-black uppercase px-2 py-1 rounded-md">Default</span>
                        <p className="font-black text-gray-900 uppercase text-xs">Home</p>
                      </div>
                      <p className="text-gray-600 leading-relaxed font-medium">123 Organic Lane, Green Park Area,<br />Bengaluru, KA 560001</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button className="text-gray-400 hover:text-olive-green font-bold text-xs uppercase">Edit</button>
                      <button className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ORDER HISTORY (Frontend Mockup) */}
            {activeTab === 'Order History' && (
              <div className="space-y-5 animate-in fade-in duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Recent Orders</h3>
                {[
                  { id: '#ORG-7721', date: 'March 05, 2026', total: '₹1,450', status: 'Delivered', color: 'text-green-600 bg-green-50' },
                  { id: '#ORG-6612', date: 'Feb 28, 2026', total: '₹890', status: 'In Transit', color: 'text-blue-600 bg-blue-50' }
                ].map((order) => (
                  <div key={order.id} className="group border border-gray-100 rounded-2xl p-5 hover:bg-gray-50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{order.id}</p>
                        <p className="text-xs font-medium text-gray-400">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900">{order.total}</p>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${order.color}`}>{order.status}</span>
                      </div>
                      <button className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm group-hover:bg-olive-green group-hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Persistent Footer Actions */}
          <div className="bg-gray-50 p-6 sm:p-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">OrganicStore © 2026 Security</p>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-12 py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-sm shadow-lg hover:bg-red-600 hover:-translate-y-1 active:translate-y-0 transition-all tracking-widest"
            >
              Logout Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;