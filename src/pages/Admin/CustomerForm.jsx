import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockCustomers } from '../../data/mockData';

const CustomerForm = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = location.pathname.includes('/edit');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phone: '',
    country: 'Select Country',
    state: 'Select State',
    zipCode: '',
    description: ''
  });

  useEffect(() => {
    if (isEditMode && customerId) {
      const customerToEdit = mockCustomers.find(c => c.id.toString() === customerId.toString());
      if (customerToEdit) {
        setFormData({
          firstName: customerToEdit.name.split(' ')[0] || '',
          lastName: customerToEdit.name.split(' ')[1] || '',
          userName: customerToEdit.name.toLowerCase().replace(/\s+/g, '_'),
          email: customerToEdit.email || '',
          phone: customerToEdit.phone || '',
          country: 'India',
          state: 'KA',
          zipCode: '560001',
          description: 'A brief description about ' + customerToEdit.name
        });
      }
    }
  }, [isEditMode, customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      alert(`Updated Customer #${customerId}: ${formData.firstName}`);
    } else {
      alert(`Created New Customer: ${formData.firstName}`);
    }
    navigate('/admin/customers');
  };

  const FormInput = ({ label, name, value, type = 'text', placeholder }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
      <input 
        type={type} 
        name={name}
        value={value} 
        onChange={handleInputChange} 
        placeholder={placeholder}
        className="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300 placeholder:italic"
      />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            {isEditMode ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1.5">
            {isEditMode ? `Update record for ID: #${customerId}` : 'Create a fresh entry for the database'}
          </p>
        </div>
        <button onClick={() => navigate('/admin/customers')} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
          ← Cancel
        </button>
      </div>

      {/* Form Content */}
      <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-200/50">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          
          <FormInput label="First Name" name="firstName" value={formData.firstName} placeholder="Enter First Name" />
          <FormInput label="Last Name" name="lastName" value={formData.lastName} placeholder="Enter Last Name" />
          <FormInput label="User Name" name="userName" value={formData.userName} placeholder="Enter User Name" />
          <FormInput label="Email Address" name="email" value={formData.email} type="email" placeholder="Enter Email" />
          <FormInput label="Phone Number" name="phone" value={formData.phone} placeholder="Enter Phone Number" />
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Country</label>
            <select name="country" value={formData.country} onChange={handleInputChange} className="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all">
              <option>Select Country</option>
              <option>India</option>
              <option>United States</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">State</label>
            <select name="state" value={formData.state} onChange={handleInputChange} className="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all">
              <option>Select State</option>
              <option>KA</option>
              <option>TN</option>
            </select>
          </div>

          <FormInput label="Zip Code" name="zipCode" value={formData.zipCode} placeholder="Enter Zip Code" />

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows="5" 
              placeholder="It contains blah blah things" 
              className="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300 placeholder:italic resize-none"
            />
          </div>

          <div className="md:col-span-2 pt-6">
            <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200/50 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                Save {isEditMode ? 'Updates' : 'Customer Record'} <span>✅</span>
            </button>
          </div>
        </form>
      </div>

    </motion.div>
  );
};

export default CustomerForm;