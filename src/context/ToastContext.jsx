import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: '',
    isVisible: false
  });

  const showToast = useCallback((message) => {
    setToast({ message, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const value = {
    toast,
    showToast,
    hideToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a fallback implementation instead of throwing an error
    return {
      toast: { message: '', isVisible: false },
      showToast: () => {},
      hideToast: () => {}
    };
  }
  return context;
};
