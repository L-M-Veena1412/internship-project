import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Register = () => {
  const navigate = useNavigate();
  const { signup, sendOTP, verifyOTP } = useAuth();
  
  const [step, setStep] = useState('form'); 
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', mobile: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await sendOTP(formData.email, 'email');
    if (res.success) setStep('email_otp');
    else setError(res.message);
    setLoading(false);
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    setError('');
    const res = await verifyOTP(formData.email, otp.join(''));
    if (res.success) {
      setOtp(['', '', '', '', '', '']);
      setStep('mobile_input');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const handleSendMobileOTP = async () => {
    setLoading(true);
    setError('');
    const res = await sendOTP(formData.mobile, 'mobile');
    if (res.success) setStep('mobile_otp');
    else setError(res.message);
    setLoading(false);
  };

  const handleFinalVerify = async () => {
    setLoading(true);
    setError('');
    const res = await verifyOTP(formData.mobile, otp.join(''));
    if (res.success) {
      const finalRes = await signup(formData);
      if (finalRes.success) navigate('/login');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf4] flex items-center justify-center py-12 px-4">
      <motion.div className="max-w-md w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        
        {/* TOP TOGGLE - Updated to Olive Green (#708A28) */}
        {step === 'form' && (
          <div className="flex bg-gray-100 rounded-full p-1 mb-8 shadow-sm">
            <button onClick={() => navigate('/login')} className="flex-1 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all">Login</button>
            <button className="flex-1 py-2.5 text-sm font-bold bg-[#708A28] text-white rounded-full shadow-lg transition-all">Register</button>
          </div>
        )}

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: REGISTRATION FORM */}
            {step === 'form' && (
              <motion.form key="form" onSubmit={handleFormSubmit} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-gray-800">Create an account</h2>
                  <p className="text-xs text-gray-400 mt-2">Already have an account? <Link to="/login" className="text-[#708A28] font-bold">Log in</Link></p>
                </div>
                
                <InputField label="Full Name" placeholder="Alex Jovan" value={formData.name} onChange={(val) => setFormData({...formData, name: val})} />
                <InputField label="Email Address" type="email" placeholder="myaccount@gmail.com" value={formData.email} onChange={(val) => setFormData({...formData, email: val})} />
                <InputField label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={(val) => setFormData({...formData, password: val})} />
                
                <Button type="submit" disabled={loading} className="w-full bg-[#708A28] hover:bg-[#5a6f20] text-white py-4 rounded-2xl mt-4 shadow-lg shadow-green-100 transition-all">
                  {loading ? 'Sending Code...' : 'Register'}
                </Button>
              </motion.form>
            )}

            {/* STEP 2 & 4: OTP VERIFICATION */}
            {(step === 'email_otp' || step === 'mobile_otp') && (
              <motion.div key="otp" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <h2 className="text-xl font-black text-gray-800 mb-2">Enter Verification Code</h2>
                <p className="text-xs text-gray-400 mb-8 leading-relaxed">Enter the 6-digit code sent to <br/><span className="font-bold text-gray-700">{step === 'email_otp' ? formData.email : formData.mobile}</span></p>
                
                {error && <p className="text-red-500 text-[10px] font-bold mb-4 uppercase tracking-wider">{error}</p>}

                <div className="flex justify-between gap-2 mb-8">
                  {otp.map((data, index) => (
                    <input 
                      key={index} 
                      type="text" 
                      maxLength="1" 
                      className="w-11 h-14 text-center text-xl font-bold border-2 border-gray-100 rounded-xl focus:border-[#708A28] focus:bg-green-50/30 outline-none transition-all" 
                      value={data} 
                      onChange={e => handleOtpChange(e.target, index)} 
                    />
                  ))}
                </div>
                
                <p className="text-xs text-gray-400 mb-8">Didn't receive a code? <button className="text-[#708A28] font-bold ml-1">Resend</button></p>
                
                <Button onClick={step === 'email_otp' ? handleVerifyEmail : handleFinalVerify} className="w-full bg-[#708A28] hover:bg-[#5a6f20] text-white py-4 rounded-2xl shadow-lg shadow-green-100 transition-all">
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
              </motion.div>
            )}

            {/* STEP 3: MOBILE NUMBER INPUT */}
            {step === 'mobile_input' && (
              <motion.div key="mobile" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6 text-center">
                <h2 className="text-xl font-black text-gray-800">Almost there!</h2>
                <p className="text-xs text-gray-400">Enter your mobile number to complete your profile.</p>
                
                <div className="text-left">
                  <label className="text-xs font-bold text-gray-700 ml-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.mobile} 
                    onChange={(e)=>setFormData({...formData, mobile: e.target.value})} 
                    className="w-full mt-1 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#708A28] outline-none transition-all" 
                    placeholder="+91 00000 00000" 
                  />
                </div>

                <Button onClick={handleSendMobileOTP} className="w-full bg-[#708A28] hover:bg-[#5a6f20] text-white py-4 rounded-2xl shadow-lg shadow-green-100 transition-all">
                  {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, type = "text", placeholder, value, onChange }) => (
  <div>
    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tighter">{label}</label>
    <input 
      type={type} 
      required 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full mt-1 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#708A28] transition-all text-sm outline-none" 
      placeholder={placeholder} 
    />
  </div>
);

export default Register;