import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// ================= PRODUCTS =================

const mockProducts = [

  // ROOT VEGETABLES
  {
    id: 1,
    name: 'Carrot',
    price: 4.99,
    description: 'Fresh organic carrots.',
    category: 'fresh-vegetables',
    subcategory: 'root-vegetables',
    image: '/images/products/carrot.jpg',
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: 'Beetroot',
    price: 3.49,
    description: 'Organic beetroot.',
    category: 'fresh-vegetables',
    subcategory: 'root-vegetables',
    image: '/images/products/beetroot.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 89,
  },
  {
    id: 3,
    name: 'Potato',
    price: 2.99,
    description: 'Fresh potatoes.',
    category: 'fresh-vegetables',
    subcategory: 'root-vegetables',
    image: '/images/products/potato.jpg',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 90,
  },

  // LEAFY VEGETABLES
  {
    id: 4,
    name: 'Spinach',
    price: 2.99,
    description: 'Organic spinach.',
    category: 'fresh-vegetables',
    subcategory: 'leafy-vegetables',
    image: '/images/products/spinach.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 167,
  },
  {
    id: 5,
    name: 'Lettuce',
    price: 3.49,
    description: 'Fresh lettuce.',
    category: 'fresh-vegetables',
    subcategory: 'leafy-vegetables',
    image: '/images/products/lettuce.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 70,
  },

  // BULB VEGETABLES
  {
    id: 6,
    name: 'Onion',
    price: 2.49,
    description: 'Fresh onions.',
    category: 'fresh-vegetables',
    subcategory: 'bulb-vegetables',
    image: '/images/products/onion.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 89,
  },
  {
    id: 7,
    name: 'Garlic',
    price: 3.99,
    description: 'Organic garlic.',
    category: 'fresh-vegetables',
    subcategory: 'bulb-vegetables',
    image: '/images/products/garlic.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 78,
  },

  // FRUITING VEGETABLES
  {
    id: 8,
    name: 'Tomato',
    price: 5.99,
    description: 'Fresh tomatoes.',
    category: 'fresh-vegetables',
    subcategory: 'fruiting-vegetables',
    image: '/images/products/tomato.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 256,
  },
  {
    id: 9,
    name: 'Bell Peppers',
    price: 4.49,
    description: 'Organic bell peppers.',
    category: 'fresh-vegetables',
    subcategory: 'fruiting-vegetables',
    image: '/images/products/bell-peppers.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 201,
  },
  {
    id: 10,
    name: 'Brinjal',
    price: 3.99,
    description: 'Fresh brinjal.',
    category: 'fresh-vegetables',
    subcategory: 'fruiting-vegetables',
    image: '/images/products/brinjal.jpg',
    inStock: true,
    featured: false,
    rating: 4.2,
    reviews: 65,
  },

  // LOCAL SEASONAL VEGETABLES
  {
    id: 11,
    name: 'Cabbage',
    price: 2.99,
    description: 'Fresh cabbage.',
    category: 'fresh-vegetables',
    subcategory: 'local-seasonal-vegetables',
    image: '/images/products/cabbage.jpg',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 75,
  },

  // EXOTIC VEGETABLES
  {
    id: 12,
    name: 'Broccoli',
    price: 5.49,
    description: 'Fresh broccoli.',
    category: 'fresh-vegetables',
    subcategory: 'exotic-vegetables',
    image: '/images/products/broccoli.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 140,
  },
  {
    id: 13,
    name: 'Zucchini',
    price: 4.49,
    description: 'Organic zucchini.',
    category: 'fresh-vegetables',
    subcategory: 'exotic-vegetables',
    image: '/images/products/zucchini.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 95,
  },

  // CITRUS FRUITS
  {
    id: 14,
    name: 'Orange',
    price: 6.99,
    description: 'Sweet oranges.',
    category: 'fresh-fruits',
    subcategory: 'citrus-fruits',
    image: '/images/products/orange.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: 15,
    name: 'Lemon',
    price: 5.49,
    description: 'Fresh lemons.',
    category: 'fresh-fruits',
    subcategory: 'citrus-fruits',
    image: '/images/products/lemon.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 134,
  },

  // TROPICAL FRUITS
  {
    id: 16,
    name: 'Mango',
    price: 8.99,
    description: 'Sweet mango.',
    category: 'fresh-fruits',
    subcategory: 'tropical-fruits',
    image: '/images/products/mango.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 267,
  },
  {
    id: 17,
    name: 'Banana',
    price: 3.99,
    description: 'Organic bananas.',
    category: 'fresh-fruits',
    subcategory: 'tropical-fruits',
    image: '/images/products/banana.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 289,
  },

  // BERRIES
  {
    id: 18,
    name: 'Strawberry',
    price: 6.99,
    description: 'Fresh strawberries.',
    category: 'fresh-fruits',
    subcategory: 'berries',
    image: '/images/products/strawberry.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 210,
  },
  {
    id: 19,
    name: 'Blueberry',
    price: 7.99,
    description: 'Fresh blueberries.',
    category: 'fresh-fruits',
    subcategory: 'berries',
    image: '/images/products/blueberry.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 175,
  },

  // EXOTIC FRUITS
  {
    id: 20,
    name: 'Dragon Fruit',
    price: 8.99,
    description: 'Exotic dragon fruit.',
    category: 'fresh-fruits',
    subcategory: 'exotic-fruits',
    image: '/images/products/dragon-fruit.jpg',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 198,
  },
  {
    id: 21,
    name: 'Kiwi',
    price: 5.99,
    description: 'Fresh kiwi.',
    category: 'fresh-fruits',
    subcategory: 'exotic-fruits',
    image: '/images/products/kiwi.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 134,
  },

  // DAIRY
  {
    id: 22,
    name: 'Milk',
    price: 4.99,
    description: 'Organic milk.',
    category: 'dairy-products',
    subcategory: 'milk',
    image: '/images/products/milk.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: 23,
    name: 'Cheese',
    price: 6.99,
    description: 'Fresh cheese.',
    category: 'dairy-products',
    subcategory: 'cheese',
    image: '/images/products/cheese.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: 24,
    name: 'Butter',
    price: 5.49,
    description: 'Organic butter.',
    category: 'dairy-products',
    subcategory: 'butter',
    image: '/images/products/butter.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 167,
  },
  {
    id: 25,
    name: 'Yogurt',
    price: 3.49,
    description: 'Fresh yogurt.',
    category: 'dairy-products',
    subcategory: 'yogurt',
    image: '/images/products/yogurt.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 156,
  },

  // BAKERY
  {
    id: 26,
    name: 'Bread',
    price: 6.99,
    description: 'Fresh bread.',
    category: 'bakery-items',
    subcategory: 'bread',
    image: '/images/products/bread.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 278,
  },
  {
    id: 27,
    name: 'Chocolate Cake',
    price: 12.99,
    description: 'Chocolate cake.',
    category: 'bakery-items',
    subcategory: 'cakes',
    image: '/images/products/chocolate-cake.jpg',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 445,
  },
  {
    id: 28,
    name: 'Cookies',
    price: 4.99,
    description: 'Fresh cookies.',
    category: 'bakery-items',
    subcategory: 'cookies',
    image: '/images/products/cookies.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 220,
  },
  {
    id: 29,
    name: 'Pastries',
    price: 5.99,
    description: 'Fresh pastries.',
    category: 'bakery-items',
    subcategory: 'pastries',
    image: '/images/products/pastries.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 190,
  },

];

// ================= CATEGORIES =================

const mockCategories = [

  {
    id: 1,
    name: 'Fresh Vegetables',
    slug: 'fresh-vegetables',
    image: '/images/categories/fresh-vegetables.jpg',
    description: 'Organic vegetables fresh from farm',
    subcategories: [
      { id: 11, name: 'Local / Seasonal Vegetables', slug: 'local-seasonal-vegetables' },
      { id: 12, name: 'Exotic Vegetables', slug: 'exotic-vegetables' },
      { id: 13, name: 'Leafy Vegetables', slug: 'leafy-vegetables' },
      { id: 14, name: 'Root Vegetables', slug: 'root-vegetables' },
      { id: 15, name: 'Bulb Vegetables', slug: 'bulb-vegetables' },
      { id: 16, name: 'Fruiting Vegetables', slug: 'fruiting-vegetables' },
    ],
  },

  {
    id: 2,
    name: 'Fresh Fruits',
    slug: 'fresh-fruits',
    image: '/images/categories/fresh-fruits.jpg',
    description: 'Sweet organic fruits',
    subcategories: [
      { id: 21, name: 'Citrus Fruits', slug: 'citrus-fruits' },
      { id: 22, name: 'Tropical Fruits', slug: 'tropical-fruits' },
      { id: 23, name: 'Berries', slug: 'berries' },
      { id: 24, name: 'Exotic Fruits', slug: 'exotic-fruits' },
    ],
  },

  {
    id: 3,
    name: 'Dairy Products',
    slug: 'dairy-products',
    image: '/images/categories/dairy-products.jpg',
    description: 'Fresh dairy products',
    subcategories: [
      { id: 31, name: 'Milk', slug: 'milk' },
      { id: 32, name: 'Cheese', slug: 'cheese' },
      { id: 33, name: 'Butter', slug: 'butter' },
      { id: 34, name: 'Yogurt', slug: 'yogurt' },
    ],
  },

  {
    id: 4,
    name: 'Bakery Items',
    slug: 'bakery-items',
    image: '/images/categories/bakery-items.jpg',
    description: 'Fresh bakery products',
    subcategories: [
      { id: 41, name: 'Bread', slug: 'bread' },
      { id: 42, name: 'Cakes', slug: 'cakes' },
      { id: 43, name: 'Cookies', slug: 'cookies' },
      { id: 44, name: 'Pastries', slug: 'pastries' },
    ],
  },

];


// ================= API FUNCTIONS =================

export const getProducts = async (filters = {}) => {

  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredProducts = [...mockProducts];

  if (filters.category)
    filteredProducts = filteredProducts.filter(p => p.category === filters.category);

  if (filters.subcategory)
    filteredProducts = filteredProducts.filter(p => p.subcategory === filters.subcategory);

  return { data: filteredProducts };

};

export const getFeaturedProducts = async () => {

  await new Promise(resolve => setTimeout(resolve, 300));

  const featuredProducts = mockProducts.filter(
    product => product.featured === true
  );

  return { data: featuredProducts };

};


export const getCategories = async () => {

  await new Promise(resolve => setTimeout(resolve, 300));

  return { data: mockCategories };

};


export const getProductById = async (id) => {

  await new Promise(resolve => setTimeout(resolve, 300));

  const product = mockProducts.find(p => p.id === parseInt(id));

  return { data: product };

};


export default api;

