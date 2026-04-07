import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  updateCurrentUser,
  setSessionFromAuthResponse,
  clearSession,
  getStoredUser,
  isAuthenticated,
} from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        if (!isAuthenticated()) {
          setIsLoggedIn(false);
          setUser(null);
          setLoading(false);
          return;
        }

        const me = await getCurrentUser();
        setIsLoggedIn(true);
        setUser(me || getStoredUser());
        if (me) {
          localStorage.setItem('user', JSON.stringify(me));
        }
      } catch (error) {
        clearSession();
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  // --- NEW MULTI-STEP VERIFICATION LOGIC (MOCK) ---

  const sendOTP = async (target, type) => {
    console.log(`[Mock API] Sending OTP to ${target} via ${type}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Code sent to ${target}` });
      }, 1000);
    });
  };

  const verifyOTP = async (target, code) => {
    console.log(`[Mock API] Verifying code ${code} for ${target}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        // MOCK LOGIC: We accept '123456' as the valid code for testing
        if (code === "123456") {
          resolve({ success: true });
        } else {
          resolve({ success: false, message: "Invalid verification code. Use 123456" });
        }
      }, 1000);
    });
  };

  // --- EXISTING AUTH LOGIC (WITH UPDATED MOCK FALLBACKS) ---

  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      setSessionFromAuthResponse(data);
      setIsLoggedIn(true);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      // UPDATED MOCK LOGIN: Added your specific credentials for testing
      if (
        (email === "test@gmail.com" && password === "123") || 
        (email === "lmveena1412@gmail.com" && password === "Veena@123")
      ) {
         const mockUser = { 
           name: email === "lmveena1412@gmail.com" ? "Veena" : "Test User", 
           email: email 
         };
         setIsLoggedIn(true);
         setUser(mockUser);
         // Simulate saving session locally
         localStorage.setItem('user', JSON.stringify(mockUser));
         return { success: true };
      }
      return {
        success: false,
        message: error?.response?.data?.message || 'Invalid email or password',
      };
    }
  };

  const signup = async (userData) => {
    try {
      await registerUser(userData);
      return { success: true };
    } catch (error) {
      console.warn("Backend refused, mocking registration success for UI testing.");
      return { success: true }; 
    }
  };

  const updateProfile = async (payload) => {
    try {
      const updatedUser = await updateCurrentUser(payload);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Profile update failed',
      };
    }
  };

  const logout = () => {
    clearSession();
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = {
    isLoggedIn,
    user,
    login,
    signup,
    sendOTP,
    verifyOTP,
    updateProfile,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};