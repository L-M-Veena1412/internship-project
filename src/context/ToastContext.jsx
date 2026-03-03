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
    // Log the error for debugging
    console.error('useToast must be used within a ToastProvider');
    // Return a working fallback implementation
    return {
      toast: { message: '', isVisible: false },
      showToast: (message) => {
        console.log('Toast fallback called with message:', message);
        // Create a temporary toast element
        const toastEl = document.createElement('div');
        toastEl.textContent = message;
        toastEl.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #16a34a;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          font-size: 14px;
          font-weight: 500;
        `;
        document.body.appendChild(toastEl);
        setTimeout(() => {
          document.body.removeChild(toastEl);
        }, 3000);
      },
      hideToast: () => {}
    };
  }
  return context;
};
