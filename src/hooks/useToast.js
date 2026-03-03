import { useState, useCallback } from 'react';

const useToast = () => {
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

  return {
    toast,
    showToast,
    hideToast
  };
};

export default useToast;
