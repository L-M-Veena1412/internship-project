import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

const ManufacturerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    zip: '',
    description: ''
  });

  useEffect(() => {
    if (isEditMode) {
      // Mock data for edit mode as seen in your image
      setFormData({
        firstName: 'Alison',
        lastName: 'Joh',
        userName: 'den_156',
        email: 'demo@gmail.com',
        phone: '+80 65498125',
        country: 'Select Country',
        state: 'Select State',
        zip: '35010',
        description: "Hi, I'm Alison, it has been the industry's standard dummy text since the 1500s."
      });
    }
  }, [isEditMode]);

  const inputClass = "w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-600 font-medium placeholder:text-slate-400";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          {isEditMode ? 'Edit Manufacturer' : 'Add Manufacturer'}
        </h2>
        <div className="flex text-[11px] font-bold text-slate-400 gap-2 items-center">
          <span>Grocerly</span> <span>&gt;</span> <span>Admin</span> <span>&gt;</span> 
          <span className="text-emerald-600">{isEditMode ? 'Edit' : 'Add'}</span>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className={labelClass}>First Name</label>
              <input type="text" placeholder="Enter First Name" className={inputClass} value={formData.firstName} />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input type="text" placeholder="Enter Last Name" className={inputClass} value={formData.lastName} />
            </div>
            <div>
              <label className={labelClass}>User Name</label>
              <input type="text" placeholder="Enter User Name" className={inputClass} value={formData.userName} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" placeholder="Enter Email" className={inputClass} value={formData.email} />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input type="text" placeholder="Enter Phone Number" className={inputClass} value={formData.phone} />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <select className={inputClass}><option>{formData.country || 'Select Country'}</option></select>
            </div>
            <div>
              <label className={labelClass}>State</label>
              <select className={inputClass}><option>{formData.state || 'Select State'}</option></select>
            </div>
            <div>
              <label className={labelClass}>Zip Code</label>
              <input type="text" placeholder="Enter Zip Code" className={inputClass} value={formData.zip} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea rows="4" className={`${inputClass} resize-none`} value={formData.description} placeholder="Enter details..." />
          </div>

          <div className="flex justify-end pt-4 gap-4">
            <button type="button" onClick={() => navigate(-1)} className="px-8 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
               {isEditMode ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ManufacturerForm;