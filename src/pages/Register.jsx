import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [activePolicy, setActivePolicy] = useState('');

  const policyContent = {
    terms: {
      title: 'Terms of Service',
      body: [
        'By creating an account, you agree to provide accurate information and keep your credentials secure.',
        'Orders can be cancelled only before dispatch. Refunds for damaged or incorrect products are processed after verification.',
        'We may update these terms from time to time. Continued use of OrganicStore means you accept those updates.'
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      body: [
        'We collect only the data required to process orders, deliver products, and provide support.',
        'Your personal data is not sold to third parties. Payment information is handled through secure payment providers.',
        'You can request profile updates or account deletion by contacting support from your registered email address.'
      ]
    }
  };

  const validateName = (name) => {
    if (!name) return 'Full name is required';
    if (!/^[a-zA-Z]/.test(name)) return 'Name must begin with a letter';
    if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(name)) return 'Name can only contain letters and spaces';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { label: 'Very Weak', color: 'bg-red-500', width: 'w-1/5' };
    if (score === 2) return { label: 'Weak', color: 'bg-orange-400', width: 'w-2/5' };
    if (score === 3) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-3/5' };
    if (score === 4) return { label: 'Strong', color: 'bg-lime-500', width: 'w-4/5' };
    return { label: 'Very Strong', color: 'bg-green-600', width: 'w-full' };
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character (!@#$%…)';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nameErr = validateName(formData.name);
    const passErr = validatePassword(formData.password);
    const confirmErr = formData.password !== formData.confirmPassword ? 'Passwords do not match' : '';

    if (nameErr || passErr || confirmErr) {
      setFieldErrors({ name: nameErr, password: passErr, confirmPassword: confirmErr });
      return;
    }

    setLoading(true);
    
    try {
      const result = await signup(formData.name, formData.email, formData.password);
      
      if (result.success) {
        // Redirect to login after successful registration
        navigate('/login');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <svg className="w-10 h-10 text-olive-green" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <span className="text-2xl font-bold text-olive-green">OrganicStore</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-dark-text">
            Create Account
          </h2>
          <p className="mt-2 text-gray-600">
            Join us for fresh organic goodness delivered to your door
          </p>
        </div>
        
        {/* Register Form */}
        <motion.div
          className="bg-white p-8 rounded-custom shadow-medium"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent ${fieldErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                placeholder="Enter your full name"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">Must start with a letter; letters and spaces only.</p>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent ${fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                placeholder="Create a password"
              />
              {formData.password && (() => {
                const strength = getPasswordStrength(formData.password);
                return (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                    </div>
                    <p className={`mt-1 text-xs font-medium ${
                      strength.label === 'Very Weak' || strength.label === 'Weak' ? 'text-red-500' :
                      strength.label === 'Fair' ? 'text-yellow-600' : 'text-green-600'
                    }`}>{strength.label}</p>
                  </div>
                );
              })()}
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">Min 8 chars, uppercase, lowercase, number &amp; special character.</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-text mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent ${fieldErrors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                placeholder="Confirm your password"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-olive-green focus:ring-olive-green border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePolicy('terms');
                  }}
                  className="text-olive-green hover:text-dark-green"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePolicy('privacy');
                  }}
                  className="text-olive-green hover:text-dark-green"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          

        </motion.div>
        
        {/* Sign In Link */}
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-olive-green hover:text-dark-green">
            Sign in here
          </Link>
        </p>
      </motion.div>

      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close popup"
            className="absolute inset-0 bg-black/50"
            onClick={() => setActivePolicy('')}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold text-dark-text">
                {policyContent[activePolicy].title}
              </h3>
              <button
                type="button"
                onClick={() => setActivePolicy('')}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
              {policyContent[activePolicy].body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Register;
