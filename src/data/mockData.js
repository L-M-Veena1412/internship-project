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

export const mockStats = {
  totalSales: 15678.50,
  totalOrders: 234,
  totalProducts: mockProducts.length,
  totalCustomers: 189,
  monthlyRevenue: 3456.78,
  pendingOrders: 12,
  lowStockProducts: 2,
  conversionRate: 3.2
};

export const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    date: "2024-03-16",
    total: 45.99,
    status: "delivered",
    items: 3,
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2024-03-16",
    total: 32.50,
    status: "processing",
    items: 2,
    paymentMethod: "PayPal"
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    date: "2024-03-15",
    total: 78.25,
    status: "shipped",
    items: 5,
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    email: "alice@example.com",
    date: "2024-03-15",
    total: 23.99,
    status: "pending",
    items: 1,
    paymentMethod: "Debit Card"
  },
  {
    id: "ORD-005",
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    date: "2024-03-14",
    total: 67.80,
    status: "delivered",
    items: 4,
    paymentMethod: "Credit Card"
  }
];

export const mockCategories = [
  { id: 1, name: "Vegetables", count: 45, icon: "🥬" },
  { id: 2, name: "Fruits", count: 32, icon: "🍎" },
  { id: 3, name: "Pantry", count: 28, icon: "🍯" },
  { id: 4, name: "Bakery", count: 15, icon: "🍞" },
  { id: 5, name: "Beverages", count: 22, icon: "🍵" }
];

export const mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234-567-8900",
    joinDate: "2024-01-15",
    totalOrders: 12,
    totalSpent: 456.78,
    status: "active"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234-567-8901",
    joinDate: "2024-02-20",
    totalOrders: 8,
    totalSpent: 234.56,
    status: "active"
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+1 234-567-8902",
    joinDate: "2024-01-10",
    totalOrders: 15,
    totalSpent: 678.90,
    status: "active"
  }
];
