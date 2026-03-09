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
    price: 0.99,
    description: 'Fresh organic carrots.',
    category: 'fresh-vegetables',
    subcategory: 'root-vegetables',
    image: '/images/products/carrot.jpg',
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 128,
    overview: 'Premium organic carrots harvested at peak freshness. These vibrant orange roots are packed with beta-carotene, fiber, and essential vitamins. Perfect for snacking, juicing, or adding natural sweetness to your favorite recipes.',
    details: [
      { label: '100% Pure & Natural:', description: 'Grown without synthetic pesticides or chemical fertilizers.' },
      { label: 'Rich in Beta-Carotene:', description: 'Excellent source of vitamin A for eye health and immunity.' },
      { label: 'Farm Fresh:', description: 'Harvested daily and delivered within 24 hours to your doorstep.' },
      { label: 'Versatile Usage:', description: 'Perfect for raw salads, cooking, juicing, or healthy snacking.' },
      { label: 'Nutrient Dense:', description: 'High in fiber, vitamin K, and essential minerals.' },
      { label: 'Storage Instructions:', description: 'Refrigerate in a plastic bag with holes for up to 2 weeks.' }
    ]
  },
  {
    id: 2,
    name: 'Beetroot',
    price: 0.79,
    description: 'Organic beetroot.',
    category: 'fresh-vegetables',
    subcategory: 'root-vegetables',
    image: '/images/products/beetroot.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 89,
    overview: 'Deep crimson organic beetroots with earthy sweetness and exceptional nutritional value. These root vegetables are rich in nitrates and antioxidants, supporting cardiovascular health and athletic performance.',
    details: [
      { label: '100% Pure & Natural:', description: 'Certified organic with no artificial additives or preservatives.' },
      { label: 'Heart Healthy:', description: 'Rich in nitrates that help lower blood pressure and improve circulation.' },
      { label: 'Antioxidant Rich:', description: 'Contains betalains that fight inflammation and cellular damage.' },
      { label: 'Farm Fresh:', description: 'Harvested at optimal ripeness for maximum flavor and nutrition.' },
      { label: 'Versatile Superfood:', description: 'Excellent for salads, juices, roasting, or as natural food coloring.' },
      { label: 'Storage Instructions:', description: 'Remove greens and store roots in refrigerator for up to 3 weeks.' }
    ]
  },
  {
    id: 3,
    name: 'Potato',
    price: 0.49,
    description: 'Fresh potatoes.',
    category: 'fresh-vegetables',
    subcategory: 'root-vegetables',
    image: '/images/products/potato.jpg',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 90,
    overview: 'Premium organic potatoes with fluffy texture and mild, nutty flavor. These versatile tubers are a staple ingredient perfect for boiling, baking, frying, or mashing into delicious comfort foods.',
    details: [
      { label: '100% Pure & Natural:', description: 'Grown in nutrient-rich soil without chemical pesticides.' },
      { label: 'Energy Rich:', description: 'Excellent source of complex carbohydrates for sustained energy.' },
      { label: 'High in Potassium:', description: 'Supports heart health and proper muscle function.' },
      { label: 'Farm Fresh:', description: 'Cured and stored properly to maintain freshness and flavor.' },
      { label: 'Culinary Versatile:', description: 'Perfect for fries, mashed potatoes, baked dishes, and curries.' },
      { label: 'Storage Instructions:', description: 'Store in cool, dark place away from onions for up to 2 months.' }
    ]
  },

  // LEAFY VEGETABLES
  {
    id: 4,
    name: 'Spinach',
    price: 0.79,
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
    price: 0.99,
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
    price: 0.79,
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
    price: 0.99,
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
    price: 1.29,
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
    price: 1.29,
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
    price: 1.79,
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
    price: 1.49,
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
    price: 1.29,
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
    price: 1.99,
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
    price: 1.49,
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
    price: 0.99,
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
    price: 1.99,
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
    price: 0.99,
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
    price: 1.99,
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
    price: 1.49,
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
    price: 2.49,
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
    price: 1.49,
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
    price: 1.29,
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
    price: 1.99,
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
    price: 1.49,
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
    price: 1.99,
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
    price: 1.49,
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
    price: 2.99,
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
    price: 1.49,
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
    price: 1.99,
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

  if (filters.search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

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

