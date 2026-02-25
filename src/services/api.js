import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= PRODUCTS ================= */

const mockProducts = [

  // ================= VEGETABLES =================

  {
    id: 1,
    name: "Fresh Beetroot",
    price: 3.49,
    description: "Sweet and earthy fresh beetroot rich in nutrients.",
    category: "fresh-vegetables",
    subcategory: "root-vegetables",
    image: "/images/products/beetroot.jpg",
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 89
  },

  {
    id: 2,
    name: "Fresh Carrot",
    price: 2.99,
    description: "Crunchy and healthy organic carrots.",
    category: "fresh-vegetables",
    subcategory: "root-vegetables",
    image: "/images/products/carrot.jpg",
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 120
  },

  {
    id: 3,
    name: "Fresh Spinach",
    price: 2.99,
    description: "Healthy organic spinach leaves.",
    category: "fresh-vegetables",
    subcategory: "leafy-vegetables",
    image: "/images/products/spinach.jpg",
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 167
  },

  {
    id: 4,
    name: "Organic Tomato",
    price: 4.49,
    description: "Juicy organic tomatoes.",
    category: "fresh-vegetables",
    subcategory: "fruiting-vegetables",
    image: "/images/products/tomato.jpg",
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 210
  },

  {
    id: 5,
    name: "Fresh Onion",
    price: 2.49,
    description: "Organic onions essential for cooking.",
    category: "fresh-vegetables",
    subcategory: "bulb-vegetables",
    image: "/images/products/onion.jpg",
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 150
  },

  // ================= FRUITS =================

  {
    id: 6,
    name: "Fresh Mango",
    price: 8.99,
    description: "Sweet tropical mango.",
    category: "fresh-fruits",
    subcategory: "tropical-fruits",
    image: "/images/products/mango.jpg",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 267
  },

  {
    id: 7,
    name: "Fresh Banana",
    price: 3.99,
    description: "Healthy organic bananas.",
    category: "fresh-fruits",
    subcategory: "tropical-fruits",
    image: "/images/products/banana.jpg",
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 289
  },

  {
    id: 8,
    name: "Fresh Apple",
    price: 6.49,
    description: "Crisp and sweet apples.",
    category: "fresh-fruits",
    subcategory: "exotic-fruits",
    image: "/images/products/apple.jpg",
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 198
  },

  {
    id: 9,
    name: "Fresh Orange",
    price: 5.49,
    description: "Juicy citrus oranges.",
    category: "fresh-fruits",
    subcategory: "citrus-fruits",
    image: "/images/products/orange.jpg",
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 132
  },

  // ================= DAIRY =================

  {
    id: 10,
    name: "Organic Milk",
    price: 2.99,
    description: "Fresh organic cow milk.",
    category: "dairy-products",
    subcategory: "milk",
    image: "/images/products/milk.jpg",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 210
  },

  {
    id: 11,
    name: "Fresh Cheese",
    price: 5.99,
    description: "Delicious organic cheese.",
    category: "dairy-products",
    subcategory: "cheese",
    image: "/images/products/cheese.jpg",
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 140
  },

  {
    id: 12,
    name: "Organic Butter",
    price: 4.49,
    description: "Pure organic butter.",
    category: "dairy-products",
    subcategory: "butter",
    image: "/images/products/butter.jpg",
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 165
  },

  {
    id: 13,
    name: "Fresh Yogurt",
    price: 3.49,
    description: "Healthy organic yogurt.",
    category: "dairy-products",
    subcategory: "yogurt",
    image: "/images/products/yogurt.jpg",
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 132
  },

  

  // ================= BAKERY =================

  {
    id: 14,
    name: "Whole Wheat Bread",
    price: 3.99,
    description: "Fresh baked whole wheat bread.",
    category: "bakery-items",
    subcategory: "bread",
    image: "/images/products/bread.jpg",
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 180
  },

  {
    id: 15,
    name: "Chocolate Cake",
    price: 12.99,
    description: "Delicious chocolate cake.",
    category: "bakery-items",
    subcategory: "cakes",
    image: "/images/products/cake.jpg",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 445
  },

  {
    id: 16,
    name: "Butter Cookies",
    price: 4.99,
    description: "Crunchy butter cookies.",
    category: "bakery-items",
    subcategory: "cookies",
    image: "/images/products/cookies.jpg",
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 99
  },

  {
    id: 17,
    name: "Croissant",
    price: 3.49,
    description: "Flaky French croissant.",
    category: "bakery-items",
    subcategory: "pastries",
    image: "/images/products/croissant.jpg",
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 156
  }

];


/* ================= CATEGORIES ================= */

const mockCategories = [

  {
    id: 1,
    name: "Fresh Vegetables",
    slug: "fresh-vegetables",
    image: "/images/categories/vegetables.jpg",
    subcategories: [
      { id: 11, name: "Leafy Vegetables", slug: "leafy-vegetables", image: "/images/subcategories/leafy-vegetables.jpg" },
      { id: 12, name: "Root Vegetables", slug: "root-vegetables", image: "/images/subcategories/root-vegetables.jpg" },
      { id: 13, name: "Bulb Vegetables", slug: "bulb-vegetables", image: "/images/subcategories/bulb-vegetables.jpg" },
      { id: 14, name: "Fruiting Vegetables", slug: "fruiting-vegetables", image: "/images/subcategories/fruiting-vegetables.jpg" }
    ]
  },

  {
    id: 2,
    name: "Fresh Fruits",
    slug: "fresh-fruits",
    image: "/images/categories/fruits.jpg",
    subcategories: [
      { id: 21, name: "Citrus Fruits", slug: "citrus-fruits", image: "/images/subcategories/citrus-fruits.jpg" },
      { id: 22, name: "Tropical Fruits", slug: "tropical-fruits", image: "/images/subcategories/tropical-fruits.jpg" },
      { id: 23, name: "Exotic Fruits", slug: "exotic-fruits", image: "/images/subcategories/exotic-fruits.jpg" }
    ]
  },

  {
    id: 3,
    name: "Dairy Products",
    slug: "dairy-products",
    image: "/images/categories/dairy.jpg",
    subcategories: [
      { id: 31, name: "Milk", slug: "milk", image: "/images/subcategories/milk.jpg" },
      { id: 32, name: "Cheese", slug: "cheese", image: "/images/subcategories/cheese.jpg" },
      { id: 33, name: "Butter", slug: "butter", image: "/images/subcategories/butter.jpg" },
      { id: 34, name: "Yogurt", slug: "yogurt", image: "/images/subcategories/yogurt.jpg" }
    ]
  },

  {
    id: 4,
    name: "Bakery Items",
    slug: "bakery-items",
    image: "/images/categories/bakery.jpg",
    subcategories: [
      { id: 41, name: "Bread", slug: "bread", image: "/images/subcategories/bread.jpg" },
      { id: 42, name: "Cakes", slug: "cakes", image: "/images/subcategories/cakes.jpg" },
      { id: 43, name: "Cookies", slug: "cookies", image: "/images/subcategories/cookies.jpg" },
      { id: 44, name: "Pastries", slug: "pastries", image: "/images/subcategories/pastries.jpg" }
    ]
  }

];


/* ================= API FUNCTIONS ================= */

export const getProducts = async (filters = {}) => {

  await new Promise(resolve => setTimeout(resolve, 300));

  let data = [...mockProducts];

  if (filters.category)
    data = data.filter(p => p.category === filters.category);

  if (filters.subcategory)
    data = data.filter(p => p.subcategory === filters.subcategory);

  return { data };
};


export const getCategories = async () => {

  await new Promise(resolve => setTimeout(resolve, 300));

  return { data: mockCategories };
};


export const getProductById = async (id) => {

  const product = mockProducts.find(p => p.id === Number(id));

  if (!product)
    throw new Error("Product not found");

  return { data: product };
};


export const getFeaturedProducts = async () => {

  await new Promise(resolve => setTimeout(resolve, 300));

  const featuredProducts = mockProducts.filter(
    product => product.featured === true
  );

  return { data: featuredProducts };

};


export default api;