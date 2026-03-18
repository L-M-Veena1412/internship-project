import axios from 'axios';

const isLocalHost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE_URL = process.env.REACT_APP_API_URL || (isLocalHost ? 'http://localhost:5000/api' : '/api');
const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const mapCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description || '',
  image: category.image || '',
  parent_id: category.parent_id,
  subcategories: (category.subcategories || []).map((sub) => ({
    id: sub.id,
    name: sub.name,
    slug: sub.slug,
    parent_id: sub.parent_id,
  })),
});

const mapProduct = (product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  price: Number(product.price),
  mrp: Number(
    product.mrp ??
      product.original_price ??
      product.originalPrice ??
      product.price
  ),
  discount: Number(
    product.discount ??
      product.discount_percentage ??
      0
  ),
  description: product.description || '',
  overview: product.overview || '',
  image: product.image || '',
  inStock: typeof product.inStock === 'boolean' ? product.inStock : Number(product.stock || 0) > 0,
  featured: Boolean(product.is_featured),
  rating: Number(product.rating || 0),
  reviews: Number(product.reviews_count || product.reviews || 0),
  category: product.category_slug || product.category || '',
  subcategory: product.subcategory_slug || product.subcategory || '',
  details: Array.isArray(product.details) ? product.details : [],
  variants: Array.isArray(product.variants) ? product.variants.map(v => ({
    id: v.id,
    weight: v.weight,
    qty: Number(v.qty || 0),
  })) : [],
  manufacturer: product.manufacturer ? {
    id: product.manufacturer.id || product.product_manufacturer,
    name: product.manufacturer.manufacturer_name || product.manufacturer.name || '',
    code: product.manufacturer.manufacturer_code || product.manufacturer.code || '',
  } : null,
});

const mapCartItem = (item) => ({
  id: item.product_id,
  cartItemId: item.id,
  name: item.name,
  image: item.image,
  price: Number(item.price),
  quantity: Number(item.quantity),
  inStock: Number(item.stock || 0) > 0,
  product_qty_id: item.product_qty_id || null,
  weight: item.product_weight || item.weight || null,
});

export const setSessionFromAuthResponse = (data) => {
  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }
  if (data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => Boolean(getStoredToken());

export const registerUser = async ({ name, email, password }) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

export const loginUser = async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data.user;
};

export const updateCurrentUser = async (payload) => {
  const res = await api.patch('/auth/me', payload);
  return res.data.user;
};

export const getCategories = async () => {
  const res = await api.get('/categories');
  return { data: (res.data.data || []).map(mapCategory) };
};

export const getCategoryBySlug = async (slug) => {
  const res = await api.get(`/categories/${slug}`);
  return { data: mapCategory(res.data.data) };
};

export const getProducts = async (filters = {}) => {
  const params = {
    limit: 1000,
    ...filters,
  };

  const res = await api.get('/products', { params });
  return {
    data: (res.data.data || []).map(mapProduct),
    pagination: res.data.pagination,
  };
};

export const getFeaturedProducts = async () => {
  const response = await getProducts({ featured: true });
  return { data: response.data };
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return { data: mapProduct(res.data.data) };
};

export const getCart = async () => {
  const res = await api.get('/cart');
  return { data: (res.data.data || []).map(mapCartItem) };
};

export const addCartItem = async ({ product_id, quantity = 1, product_qty_id = null }) => {
  const payload = { product_id, quantity };
  if (product_qty_id) {
    payload.product_qty_id = product_qty_id;
  }
  const res = await api.post('/cart/items', payload);
  return res.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const res = await api.patch(`/cart/items/${itemId}`, { quantity });
  return res.data;
};

export const removeCartItem = async (itemId) => {
  const res = await api.delete(`/cart/items/${itemId}`);
  return res.data;
};

export const clearServerCart = async () => {
  const res = await api.delete('/cart');
  return res.data;
};

export const placeOrder = async (payload) => {
  const res = await api.post('/orders', payload);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get('/orders/my');
  return { data: res.data.data || [] };
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return { data: res.data.data };
};

export default api;
