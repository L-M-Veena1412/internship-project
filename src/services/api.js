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
  // Fresh Vegetables - Root Vegetables
  {
    id: 1,
    name: 'Organic Carrots',
    price: 4.99,
    description: 'Fresh, crunchy organic carrots perfect for snacking or cooking.',
    category: 'fresh-vegetables',
    subcategory: 'exotic-vegetables',
    image: 'https://images.unsplash.com/photo-1445282768811-6a790c3c3529?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: 'Fresh Beetroot',
    price: 3.49,
    description: 'Sweet and earthy organic beetroots, rich in nutrients.',
    category: 'fresh-vegetables',
    subcategory: 'exotic-vegetables',
    image: '/images/products/beetroot.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 89
  },
  
  // Fresh Vegetables - Leafy Vegetables
  {
    id: 3,
    name: 'Organic Spinach',
    price: 2.99,
    description: 'Fresh organic spinach leaves, rich in vitamins and minerals.',
    category: 'fresh-vegetables',
    subcategory: 'leafy-vegetables',
    image: '/images/products/spinach.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 167
  },
  {
    id: 4,
    name: 'Fresh Coriander',
    price: 1.99,
    description: 'Aromatic organic coriander leaves perfect for garnishing.',
    category: 'fresh-vegetables',
    subcategory: 'leafy-vegetables',
    image: '/images/products/coriander.jpg',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 67
  },
  {
    id: 26,
    name: 'Organic Lettuce',
    price: 3.49,
    description: 'Crisp organic lettuce leaves perfect for salads.',
    category: 'fresh-vegetables',
    subcategory: 'leafy-vegetables',
    image: '/images/products/lettuce.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 89
  },
  {
    id: 27,
    name: 'Fresh Red Cabbage',
    price: 4.99,
    description: 'Vibrant organic red cabbage, rich in antioxidants.',
    category: 'fresh-vegetables',
    subcategory: 'leafy-vegetables',
    image: '/images/products/cabbage.jpg',
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 123
  },
  {
    id: 28,
    name: 'Organic Broccoli',
    price: 5.49,
    description: 'Fresh organic broccoli florets, packed with nutrients.',
    category: 'fresh-vegetables',
    subcategory: 'leafy-vegetables',
    image: '/images/products/broccoli.jpg',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 198
  },
  {
    id: 29,
    name: 'Fresh Zucchini',
    price: 3.99,
    description: 'Tender organic zucchini perfect for grilling or sautéing.',
    category: 'fresh-vegetables',
    subcategory: 'fruiting-vegetables',
    image: '/images/products/zucchini.jpg',
    inStock: true,
    featured: false,
    rating: 4.1,
    reviews: 67
  },
  {
    id: 30,
    name: 'Organic Tomatoes',
    price: 4.49,
    description: 'Juicy organic tomatoes, perfect for cooking.',
    category: 'fresh-vegetables',
    subcategory: 'local-seasonal-vegetables',
    image: 'https://images.unsplash.com/photo-1596797038534-7c9a7e8d5a0c?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 234
  },
  {
    id: 31,
    name: 'Fresh Potatoes',
    price: 3.99,
    description: 'Organic potatoes, versatile for all cooking methods.',
    category: 'fresh-vegetables',
    subcategory: 'root-vegetables',
    image: 'https://images.unsplash.com/photo-1445282768811-6a790c3c3529?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 178
  },
  {
    id: 32,
    name: 'Organic Brinjal',
    price: 5.99,
    description: 'Fresh organic brinjal, perfect for curries and grilling.',
    category: 'fresh-vegetables',
    subcategory: 'local-seasonal-vegetables',
    image: '/images/products/brinjal.jpg',
    inStock: true,
    featured: false,
    rating: 4.2,
    reviews: 89
  },
  {
    id: 33,
    name: 'Fresh Green Beans',
    price: 4.29,
    description: 'Crisp organic green beans, rich in fiber.',
    category: 'fresh-vegetables',
    subcategory: 'local-seasonal-vegetables',
    image: '/images/products/green-beans.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 145
  },
  
  // Fresh Vegetables - Bulb Vegetables
  {
    id: 5,
    name: 'Organic Onions',
    price: 2.49,
    description: 'Fresh organic onions, essential for cooking.',
    category: 'fresh-vegetables',
    subcategory: 'bulb-vegetables',
    image: '/images/products/onion.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 89
  },
  {
    id: 6,
    name: 'Fresh Garlic',
    price: 3.99,
    description: 'Aromatic organic garlic bulbs, perfect for flavoring dishes.',
    category: 'fresh-vegetables',
    subcategory: 'bulb-vegetables',
    image: '/images/products/garlic.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 78
  },
  
  // Fresh Vegetables - Fruiting Vegetables
  {
    id: 7,
    name: 'Organic Tomatoes',
    price: 5.99,
    description: 'Fresh, juicy organic tomatoes grown without pesticides.',
    category: 'fresh-vegetables',
    subcategory: 'fruiting-vegetables',
    image: '/images/products/tomato.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 256
  },
  {
    id: 8,
    name: 'Fresh Bell Peppers',
    price: 4.49,
    description: 'Colorful organic bell peppers, sweet and crisp.',
    category: 'fresh-vegetables',
    subcategory: 'fruiting-vegetables',
    image: '/images/products/bell-peppers.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 201
  },
  
  // Fresh Fruits - Citrus Fruits
  {
    id: 9,
    name: 'Fresh Oranges',
    price: 6.99,
    description: 'Sweet and juicy organic oranges, rich in vitamin C.',
    category: 'fresh-fruits',
    subcategory: 'citrus-fruits',
    image: '/images/products/orange.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 189
  },
  {
    id: 10,
    name: 'Organic Lemons',
    price: 5.49,
    description: 'Tangy organic lemons, perfect for cooking and drinks.',
    category: 'fresh-fruits',
    subcategory: 'citrus-fruits',
    image: '/images/products/lemon.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 134
  },
  
  // Fresh Fruits - Tropical Fruits
  {
    id: 11,
    name: 'Fresh Mangoes',
    price: 8.99,
    description: 'Sweet and tropical organic mangoes, perfectly ripe.',
    category: 'fresh-fruits',
    subcategory: 'tropical-fruits',
    image: '/images/products/mango.jpg',
    inStock: true,
    featured: false,
    rating: 4.8,
    reviews: 267
  },
  {
    id: 12,
    name: 'Organic Bananas',
    price: 3.99,
    description: 'Creamy organic bananas, rich in potassium.',
    category: 'fresh-fruits',
    subcategory: 'tropical-fruits',
    image: '/images/products/banana.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 289
  },
  
  // Fresh Fruits - Berries
  {
    id: 13,
    name: 'Fresh Strawberries',
    price: 7.99,
    description: 'Sweet and juicy organic strawberries perfect for desserts.',
    category: 'fresh-fruits',
    subcategory: 'berries',
    image: '/images/products/strawberry.jpg',
    inStock: true,
    featured: false,
    rating: 4.9,
    reviews: 312
  },
  {
    id: 14,
    name: 'Organic Blueberries',
    price: 9.99,
    description: 'Sweet and tart organic blueberries, packed with antioxidants.',
    category: 'fresh-fruits',
    subcategory: 'berries',
    image: '/images/products/blueberry.jpg',
    inStock: true,
    featured: false,
    rating: 4.8,
    reviews: 278
  },
  
  // Fresh Fruits - Exotic Fruits
  {
    id: 34,
    name: 'Fresh Dragon Fruit',
    price: 12.99,
    description: 'Exotic organic dragon fruit with vibrant pink color and unique flavor.',
    category: 'fresh-fruits',
    subcategory: 'exotic-fruits',
    image: '/images/products/dragon-fruit.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 156
  },
  {
    id: 35,
    name: 'Organic Kiwi',
    price: 8.99,
    description: 'Tangy and sweet organic kiwi fruit, rich in vitamin C.',
    category: 'fresh-fruits',
    subcategory: 'exotic-fruits',
    image: '/images/products/kiwi.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 36,
    name: 'Fresh Avocado',
    price: 7.49,
    description: 'Creamy organic avocados, perfect for toast and salads.',
    category: 'fresh-fruits',
    subcategory: 'exotic-fruits',
    image: '/images/products/avocado.jpg',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 267
  },
  
  // Dairy Products - Milk
  {
    id: 15,
    name: 'Organic Cow Milk',
    price: 4.99,
    description: 'Fresh organic cow milk, rich and creamy.',
    category: 'dairy-products',
    subcategory: 'milk',
    image: '/images/products/milk.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 189
  },
  {
    id: 16,
    name: 'Almond Milk',
    price: 5.99,
    description: 'Creamy organic almond milk, dairy-free alternative.',
    category: 'dairy-products',
    subcategory: 'milk',
    image: '/images/products/almond-milk.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 145
  },
  
  // Dairy Products - Cheese
  {
    id: 17,
    name: 'Mozzarella Cheese',
    price: 6.99,
    description: 'Soft and creamy organic mozzarella cheese.',
    category: 'dairy-products',
    subcategory: 'cheese',
    image: '/images/products/cheese.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 189
  },
  
  // Dairy Products - Butter
  {
    id: 19,
    name: 'Organic Butter',
    price: 5.49,
    description: 'Rich and creamy organic butter from grass-fed cows.',
    category: 'dairy-products',
    subcategory: 'butter',
    image: '/images/subcategories/berries.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 167
  },
  
  // Dairy Products - Yogurt
  {
    id: 20,
    name: 'Greek Yogurt',
    price: 4.99,
    description: 'Thick and creamy organic Greek yogurt.',
    category: 'dairy-products',
    subcategory: 'yogurt',
    image: '/images/products/yogurt.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 201
  },
  
  // Bakery Items - Bread
  {
    id: 21,
    name: 'Sourdough Bread',
    price: 6.99,
    description: 'Artisan organic sourdough bread with crispy crust.',
    category: 'bakery-items',
    subcategory: 'bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 278
  },
  {
    id: 22,
    name: 'Whole Wheat Bread',
    price: 5.49,
    description: 'Nutritious organic whole wheat bread.',
    category: 'bakery-items',
    subcategory: 'bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 134
  },
  
  // Bakery Items - Cakes
  {
    id: 23,
    name: 'Organic Chocolate Cake',
    price: 12.99,
    description: 'Decadent organic chocolate cake, perfect for celebrations.',
    category: 'bakery-items',
    subcategory: 'cakes',
    image: '/images/products/chocolate-cake.jpg',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 445
  },
  
  // Bakery Items - Cookies
  {
    id: 24,
    name: 'Organic Chocolate Chip Cookies',
    price: 8.99,
    description: 'Freshly baked organic chocolate chip cookies.',
    category: 'bakery-items',
    subcategory: 'cookies',
    image: '/images/products/cookies.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 223
  },
  
  // Bakery Items - Pastries
  {
    id: 25,
    name: 'Organic Croissants',
    price: 7.49,
    description: 'Buttery and flaky organic croissants, perfect for breakfast.',
    category: 'bakery-items',
    subcategory: 'pastries',
    image: '/images/products/croissant.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 189
  }
];

const mockCategories = [
  {
    id: 1,
    name: 'Fresh Vegetables',
    slug: 'fresh-vegetables',
    image: '/images/subcategories/leafy-vegetables.jpg',
    description: 'Organic vegetables fresh from farm',
    subcategories: [
      { id: 11, name: 'Local / Seasonal Vegetables', slug: 'local-seasonal-vegetables' },
      { id: 12, name: 'Exotic Vegetables', slug: 'exotic-vegetables' },
      { id: 13, name: 'Leafy Vegetables', slug: 'leafy-vegetables' },
      { id: 14, name: 'Root Vegetables', slug: 'root-vegetables' },
      { id: 15, name: 'Bulb Vegetables', slug: 'bulb-vegetables' },
      { id: 16, name: 'Fruiting Vegetables', slug: 'fruiting-vegetables' }
    ]
  },
  {
    id: 2,
    name: 'Fresh Fruits',
    slug: 'fresh-fruits',
    image: '/images/subcategories/citrus-fruits.jpg',
    description: 'Sweet and juicy organic fruits',
    subcategories: [
      { id: 21, name: 'Citrus Fruits', slug: 'citrus-fruits' },
      { id: 22, name: 'Tropical Fruits', slug: 'tropical-fruits' },
      { id: 23, name: 'Berries', slug: 'berries' },
      { id: 24, name: 'Exotic Fruits', slug: 'exotic-fruits' }
    ]
  },
  {
    id: 3,
    name: 'Dairy Products',
    slug: 'dairy-products',
    image: '/images/products/milk.jpg',
    description: 'Fresh organic dairy products',
    subcategories: [
      { id: 31, name: 'Milk', slug: 'milk' },
      { id: 32, name: 'Cheese', slug: 'cheese' },
      { id: 33, name: 'Butter', slug: 'butter' },
      { id: 34, name: 'Yogurt', slug: 'yogurt' }
    ]
  },
  {
    id: 4,
    name: 'Bakery Items',
    slug: 'bakery-items',
    image: '/images/products/bread.jpg',
    description: 'Freshly baked organic goods',
    subcategories: [
      { id: 41, name: 'Bread', slug: 'bread' },
      { id: 42, name: 'Cakes', slug: 'cakes' },
      { id: 43, name: 'Cookies', slug: 'cookies' },
      { id: 44, name: 'Pastries', slug: 'pastries' }
    ]
  }
];

// API functions
export const getProducts = async (filters = {}) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredProducts = [...mockProducts];
  
  // Filter by category and subcategory
  if (filters.category && filters.subcategory) {
    filteredProducts = filteredProducts.filter(product => 
      product.category === filters.category && product.subcategory === filters.subcategory
    );
  } else if (filters.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category === filters.category
    );
  }
  
  // Filter by search term
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by featured status
  if (filters.featured) {
    filteredProducts = filteredProducts.filter(product => 
      product.featured
    );
  }
  
  return { data: filteredProducts };
};

export const getCategories = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return { data: mockCategories };
};

export const getProductById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const product = mockProducts.find(p => p.id === parseInt(id));
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return { data: product };
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
