import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development
const mockProducts = [
  {
    id: 1,
    name: 'Organic Fresh Tomatoes',
    price: 4.99,
    description: 'Fresh, juicy organic tomatoes grown without pesticides. Perfect for salads and cooking.',
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: 'Fresh Avocados',
    price: 3.49,
    description: 'Creamy, ripe avocados perfect for toast, salads, or guacamole.',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 256
  },
  {
    id: 3,
    name: 'Organic Spinach',
    price: 2.99,
    description: 'Fresh organic spinach leaves, rich in vitamins and minerals.',
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 89
  },
  {
    id: 4,
    name: 'Fresh Strawberries',
    price: 5.99,
    description: 'Sweet, juicy organic strawberries perfect for desserts and snacks.',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 342
  },
  {
    id: 5,
    name: 'Organic Carrots',
    price: 2.49,
    description: 'Crunchy organic carrots, great for snacking or cooking.',
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1445282768811-6a790c3c3529?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 167
  },
  {
    id: 6,
    name: 'Fresh Blueberries',
    price: 6.99,
    description: 'Sweet and tart organic blueberries, packed with antioxidants.',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 198
  },
  {
    id: 7,
    name: 'Organic Broccoli',
    price: 3.99,
    description: 'Fresh organic broccoli florets, perfect for steaming or stir-frying.',
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
    rating: 4.2,
    reviews: 134
  },
  {
    id: 8,
    name: 'Fresh Apples',
    price: 4.49,
    description: 'Crisp, sweet organic apples perfect for eating fresh or baking.',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 278
  }
];

const mockCategories = [
  {
    id: 1,
    name: 'Fresh Vegetables',
    slug: 'vegetables',
    image: 'https://images.unsplash.com/photo-1540420773422-336899f073db?w=400&h=300&fit=crop',
    description: 'Organic vegetables fresh from the farm'
  },
  {
    id: 2,
    name: 'Fresh Fruits',
    slug: 'fruits',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop',
    description: 'Sweet and juicy organic fruits'
  },
  {
    id: 3,
    name: 'Dairy Products',
    slug: 'dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
    description: 'Fresh organic dairy products'
  },
  {
    id: 4,
    name: 'Bakery Items',
    slug: 'bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    description: 'Freshly baked organic goods'
  }
];

// API functions
export const getProducts = async (filters = {}) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredProducts = [...mockProducts];
  
  if (filters.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category === filters.category
    );
  }
  
  if (filters.featured) {
    filteredProducts = filteredProducts.filter(product => 
      product.featured
    );
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  return { data: filteredProducts };
};

export const getProductById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const product = mockProducts.find(p => p.id === parseInt(id));
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return { data: product };
};

export const getCategories = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return { data: mockCategories };
};

export const getFeaturedProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const featured = mockProducts.filter(product => product.featured);
  
  return { data: featured };
};

// Auth API (mock)
export const login = async (credentials) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock login validation
  if (credentials.email === 'user@example.com' && credentials.password === 'password') {
    return { 
      data: { 
        token: 'mock-jwt-token',
        user: { id: 1, name: 'John Doe', email: 'user@example.com' }
      }
    };
  }
  
  throw new Error('Invalid credentials');
};

export const register = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { 
    data: { 
      token: 'mock-jwt-token',
      user: { id: 2, name: userData.name, email: userData.email }
    }
  };
};

export default api;
