export const mockProducts = [
  {
    id: 1,
    name: "Organic Fresh Spinach",
    category: "Vegetables",
    price: 4.99,
    originalPrice: 6.99,
    description: "Fresh, crisp organic spinach perfect for salads and cooking. Rich in vitamins and minerals.",
    image: "/images/spinach.jpg",
    stock: 150,
    rating: 4.5,
    reviews: 23,
    featured: true,
    organic: true,
    inStock: true
  },
  {
    id: 2,
    name: "Organic Honey Raw",
    category: "Pantry",
    price: 12.99,
    originalPrice: 15.99,
    description: "Pure, unprocessed raw honey from organic farms. Natural sweetness with health benefits.",
    image: "/images/honey.jpg",
    stock: 85,
    rating: 4.8,
    reviews: 45,
    featured: true,
    organic: true,
    inStock: true
  },
  {
    id: 3,
    name: "Organic Avocados (4 pack)",
    category: "Fruits",
    price: 8.99,
    originalPrice: 10.99,
    description: "Premium organic avocados, perfectly ripe and creamy. Ideal for toast, salads, and guacamole.",
    image: "/images/avocados.jpg",
    stock: 200,
    rating: 4.7,
    reviews: 67,
    featured: false,
    organic: true,
    inStock: true
  },
  {
    id: 4,
    name: "Organic Whole Grain Bread",
    category: "Bakery",
    price: 5.49,
    originalPrice: 6.49,
    description: "Freshly baked organic whole grain bread. High fiber, no preservatives, perfect for sandwiches.",
    image: "/images/bread.jpg",
    stock: 45,
    rating: 4.3,
    reviews: 19,
    featured: false,
    organic: true,
    inStock: true
  },
  {
    id: 5,
    name: "Organic Green Tea",
    category: "Beverages",
    price: 9.99,
    originalPrice: 12.99,
    description: "Premium organic green tea leaves. Rich in antioxidants, smooth flavor, and natural energy boost.",
    image: "/images/green-tea.jpg",
    stock: 120,
    rating: 4.6,
    reviews: 34,
    featured: true,
    organic: true,
    inStock: true
  }
];

export const mockCategories = [
  { id: 1, name: "Vegetables", count: 45 },
  { id: 2, name: "Fruits", count: 32 },
  { id: 3, name: "Pantry", count: 28 },
  { id: 4, name: "Bakery", count: 15 },
  { id: 5, name: "Beverages", count: 22 }
];

export const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    date: "2024-03-13",
    total: 45.99,
    status: "delivered",
    items: 3
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2024-03-13",
    total: 32.50,
    status: "processing",
    items: 2
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    date: "2024-03-12",
    total: 78.25,
    status: "shipped",
    items: 5
  }
];

// Added this here to centralize data
export const mockStats = [
  { label: 'Total Sales', value: '$12,450', icon: '💰', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Total Orders', value: '156', icon: '🛒', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Products', value: '42', icon: '📦', color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Active Customers', value: '890', icon: '👥', color: 'text-purple-600', bg: 'bg-purple-50' },
];