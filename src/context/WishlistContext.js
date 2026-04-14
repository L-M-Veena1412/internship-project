import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // Initialize state from LocalStorage to persist data on refresh
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('organic_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing wishlist from localStorage:", error);
      return [];
    }
  });

  // Sync state to LocalStorage whenever the wishlist changes
  useEffect(() => {
    localStorage.setItem('organic_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  /**
   * Toggles a product in/out of the wishlist
   * Handles String/Number ID mismatches automatically
   */
  const toggleWishlist = (product) => {
    if (!product || !product.id) return;

    setWishlist((prev) => {
      // Find if item exists using String comparison for safety
      const isExist = prev.find((item) => String(item.id) === String(product.id));
      
      if (isExist) {
        // Remove item if it exists
        return prev.filter((item) => String(item.id) !== String(product.id));
      } else {
        // Add item if it doesn't exist
        return [...prev, product];
      }
    });
  };

  /**
   * Helper to check if a specific product ID is wishlisted
   */
  const isInWishlist = (id) => {
    return wishlist.some((item) => String(item.id) === String(id));
  };

  /**
   * Optional: Clear the entire wishlist
   */
  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};