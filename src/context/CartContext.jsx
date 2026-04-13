import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { useAuth } from './AuthContext';
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearServerCart,
} from '../services/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      // Ensure we compare IDs as strings to prevent duplicate key errors
      const productId = String(action.payload.id);
      const existingItem = state.items.find((item) => String(item.id) === productId);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            String(item.id) === productId
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => String(item.id) !== String(action.payload)),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          String(item.id) === String(action.payload.id)
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: Array.isArray(action.payload) ? action.payload : [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { isLoggedIn } = useAuth();

  const loadServerCart = useCallback(async () => {
    try {
      const response = await getCart();
      dispatch({ type: 'LOAD_CART', payload: response.data || [] });
    } catch (error) {
      console.error('Failed to load server cart', error);
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn) {
        await loadServerCart();
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
          } catch (error) {
            dispatch({ type: 'LOAD_CART', payload: [] });
          }
        }
      }
    };
    loadCart();
  }, [isLoggedIn, loadServerCart]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, isLoggedIn]);

  const addToCart = useCallback(
    async (product, quantity = 1, variantId = null) => {
      // 1. UPDATE UI IMMEDIATELY (Optimistic Update)
      const itemKey = variantId ? `${product.id}-variant-${variantId}` : product.id;
      dispatch({ 
        type: 'ADD_TO_CART', 
        payload: { ...product, quantity, product_qty_id: variantId, id: itemKey } 
      });

      // 2. SYNC WITH SERVER IN BACKGROUND
      if (isLoggedIn) {
        try {
          if (variantId) {
            await addCartItem({ product_id: product.id, quantity, product_qty_id: variantId });
          } else {
            await addCartItem({ product_id: product.id, quantity });
          }
          // We don't call loadServerCart() here anymore to prevent flickering 
          // because we've already updated the local state.
        } catch (error) {
          console.warn("Server sync failed, item remains in local cart (Mock Mode)");
        }
      }
    },
    [isLoggedIn]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      const originalItems = [...state.items];
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });

      if (isLoggedIn) {
        try {
          const item = originalItems.find((cartItem) => String(cartItem.id) === String(productId));
          if (item?.cartItemId) {
            await removeCartItem(item.cartItemId);
          }
        } catch (error) {
          console.warn("Failed to remove from server");
        }
      }
    },
    [isLoggedIn, state.items]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });

      if (isLoggedIn) {
        try {
          const item = state.items.find((cartItem) => String(cartItem.id) === String(productId));
          if (item?.cartItemId) {
            await updateCartItem(item.cartItemId, quantity);
          }
        } catch (error) {
          console.warn("Failed to update quantity on server");
        }
      }
    },
    [isLoggedIn, state.items, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    dispatch({ type: 'CLEAR_CART' });
    if (isLoggedIn) {
      try {
        await clearServerCart();
      } catch (error) {
        console.warn("Failed to clear server cart");
      }
    }
  }, [isLoggedIn]);

  const getCartTotal = useCallback(() => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [state.items]);
const getCartItemsCount = useCallback(() => {
  return state.items.length; // This counts unique products only
}, [state.items]);
  

  const value = {
    items: state.items,
    cart: state.items,      // Keeping 'cart' for ProductCard.jsx compatibility
    cartItems: state.items, // Keeping 'cartItems' for other components
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};