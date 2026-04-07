import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    console.log("Google login triggered");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#fdfbf4] flex items-center justify-center py-12 px-4">
      <motion.div className="max-w-md w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* SHARED TOGGLE TABS - Updated to Olive Green (#708A28) */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-8 shadow-sm">
          <button className="flex-1 py-2.5 text-sm font-bold bg-[#708A28] text-white rounded-full shadow-lg transition-all">
            Login
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="flex-1 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
          >
            Register
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-800">Welcome Back</h2>
            <p className="text-xs text-gray-400 mt-2">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="text-xs font-bold text-gray-700 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full mt-1 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#708A28] transition-all outline-none"
                placeholder="myaccount@gmail.com"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-700 ml-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full mt-1 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#708A28] transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center text-xs text-gray-500 font-medium cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mr-2 rounded border-gray-300 text-[#708A28] focus:ring-[#708A28]" 
                />
                Remember Me
              </label>
              <button type="button" className="text-xs font-bold text-[#708A28] hover:text-[#5a6f20]">
                Forgot Password?
              </button>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#708A28] hover:bg-[#5a6f20] text-white py-4 rounded-2xl mt-4 shadow-lg shadow-green-100 transition-all"
            >
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-400 font-bold uppercase tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
                <span className="text-sm font-bold text-gray-700">Continue with Google</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8 font-medium">
            Don't have an account? <Link to="/register" className="text-[#708A28] font-black">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;