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

  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      setSessionFromAuthResponse(data);
      setIsLoggedIn(true);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Invalid email or password',
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      await registerUser({ name, email, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Registration failed',
      };
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
