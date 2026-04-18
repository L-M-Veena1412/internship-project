import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockCustomers } from '../../data/mockData';

const CustomerForm = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = location.pathname.includes('/edit');

  // 1. Updated State: fullName replaces first/last name, location replaces state/district/city
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'India',
    location: '',
    zipCode: '',
    description: ''
  });

  // State for the Autocomplete Dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock Database of locations for the autocomplete to filter through
  const mockLocations = [
    "Ankola, Uttara Kannada, Karnataka, India",
    "Bengaluru, Karnataka, India",
    "Chennai, Tamil Nadu, India",
    "Delhi, National Capital Territory of Delhi, India",
    "Hyderabad, Karnataka, India",
    "Kochi, Kerala, India",
    "Mangaluru, Dakshina Kannada, Karnataka, India",
    "Mumbai, Maharashtra, India",
    "Mysuru, Karnataka, India",
    "Pune, Maharashtra, India"
  ];

  useEffect(() => {
    if (isEditMode && customerId) {
      const customerToEdit = mockCustomers.find(c => c.id.toString() === customerId.toString());
      if (customerToEdit) {
        setFormData({
          fullName: customerToEdit.name || '',
          email: customerToEdit.email || '',
          phone: customerToEdit.phone || '',
          country: 'India',
          location: 'Bengaluru, Karnataka, India', // Default for edit mode example
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

  // Handles clicking a location from the dropdown suggestions
  const handleLocationSelect = (selectedLocation) => {
    setFormData(prev => ({ ...prev, location: selectedLocation }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      alert(`Updated Customer #${customerId}: ${formData.fullName}`);
    } else {
      alert(`Created New Customer: ${formData.fullName}`);
    }
    navigate('/admin/customers');
  };

  // Reusable Input Component
  const FormInput = ({ label, name, value, type = 'text', placeholder, className = '' }) => (
    <div className={`flex flex-col gap-2 ${className}`}>
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

  // Filter locations based on what the user types
  const filteredLocations = mockLocations.filter(loc => 
    loc.toLowerCase().includes(formData.location.toLowerCase())
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
          
          {/* Row 1: Full Name spans both columns */}
          <FormInput 
            label="Full Name" 
            name="fullName" 
            value={formData.fullName} 
            placeholder="Enter Full Name" 
            className="md:col-span-2"
          />
          
          {/* Row 2: Email & Phone together */}
          <FormInput label="Email Address" name="email" value={formData.email} type="email" placeholder="Enter Email" />
          <FormInput label="Phone Number" name="phone" value={formData.phone} placeholder="Enter Phone Number" />
          
          {/* Row 3: Country Dropdown & Location Autocomplete */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Country</label>
            <select name="country" value={formData.country} onChange={handleInputChange} className="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all">
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>

          {/* Autocomplete Location Input */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">City / Location</label>
            <input 
              type="text" 
              name="location"
              value={formData.location} 
              onChange={(e) => {
                handleInputChange(e);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              // Delay hiding so we can register the click on a suggestion
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Start typing a city (e.g. Ankola)..."
              className="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 placeholder:italic"
            />
            
            {/* Dropdown Suggestions Box */}
            <AnimatePresence>
              {showSuggestions && formData.location && filteredLocations.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-[100%] left-0 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto"
                >
                  {filteredLocations.map((loc, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleLocationSelect(loc)}
                      className="px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                    >
                      {loc}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 4: Zip Code */}
          <FormInput label="Zip Code" name="zipCode" value={formData.zipCode} placeholder="Enter Zip Code" />
          
          {/* Empty div to keep grid alignment if needed, or Zip Code can just span 1 column natively */}
          <div className="hidden md:block"></div>

          {/* Row 5: Description */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows="5" 
              placeholder="It contains blah blah things..." 
              className="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300 placeholder:italic resize-none"
            />
          </div>

          {/* Submit Button */}
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