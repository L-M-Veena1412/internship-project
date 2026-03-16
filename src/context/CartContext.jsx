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
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
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
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
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
    const response = await getCart();
    dispatch({ type: 'LOAD_CART', payload: response.data || [] });
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn) {
        try {
          await loadServerCart();
        } catch (error) {
          console.error('Failed to load server cart', error);
          dispatch({ type: 'LOAD_CART', payload: [] });
        }
        return;
      }

      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        } catch (error) {
          console.error('Failed to parse local cart', error);
          dispatch({ type: 'LOAD_CART', payload: [] });
        }
      } else {
        dispatch({ type: 'LOAD_CART', payload: [] });
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
    async (product, quantity = 1) => {
      if (isLoggedIn) {
        await addCartItem({ product_id: product.id, quantity });
        await loadServerCart();
        return;
      }

      dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
    },
    [isLoggedIn, loadServerCart]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      if (isLoggedIn) {
        const item = state.items.find((cartItem) => cartItem.id === productId);
        if (item?.cartItemId) {
          await removeCartItem(item.cartItemId);
          await loadServerCart();
        }
        return;
      }

      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    },
    [isLoggedIn, state.items, loadServerCart]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      if (isLoggedIn) {
        const item = state.items.find((cartItem) => cartItem.id === productId);
        if (item?.cartItemId) {
          await updateCartItem(item.cartItemId, quantity);
          await loadServerCart();
        }
        return;
      }

      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    },
    [isLoggedIn, state.items, removeFromCart, loadServerCart]
  );

  const clearCart = useCallback(async () => {
    if (isLoggedIn) {
      await clearServerCart();
      dispatch({ type: 'CLEAR_CART' });
      return;
    }

    dispatch({ type: 'CLEAR_CART' });
  }, [isLoggedIn]);

  const getCartTotal = useCallback(() => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [state.items]);

  const getCartItemsCount = useCallback(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }, [state.items]);

  const value = {
    items: state.items,
    cart: state.items,
    cartItems: state.items,
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
