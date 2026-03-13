// Mock data for Admin Dashboard
export const mockProducts = [
  {
    id: 1,
    name: 'Organic Carrots',
    price: 2.99,
    category: 'Vegetables',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=200&h=200&fit=crop',
    status: 'in-stock',
    description: 'Fresh organic carrots from local farms',
    sku: 'ORG-001',
    lastUpdated: '2024-03-13'
  },
  {
    id: 2,
    name: 'Organic Spinach',
    price: 3.49,
    category: 'Leafy Greens',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop',
    status: 'out-of-stock',
    description: 'Premium organic spinach leaves',
    sku: 'ORG-002',
    lastUpdated: '2024-03-12'
  },
  {
    id: 3,
    name: 'Organic Tomatoes',
    price: 4.99,
    category: 'Vegetables',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=200&h=200&fit=crop',
    status: 'in-stock',
    description: 'Vine-ripened organic tomatoes',
    sku: 'ORG-003',
    lastUpdated: '2024-03-13'
  },
  {
    id: 4,
    name: 'Organic Apples',
    price: 5.99,
    category: 'Fruits',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop',
    status: 'in-stock',
    description: 'Crisp organic apples',
    sku: 'ORG-004',
    lastUpdated: '2024-03-11'
  },
  {
    id: 5,
    name: 'Organic Milk',
    price: 6.99,
    category: 'Dairy',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1550583720-b5164eeb4b4f?w=200&h=200&fit=crop',
    status: 'low-stock',
    description: 'Fresh organic whole milk',
    sku: 'ORG-005',
    lastUpdated: '2024-03-13'
  },
  {
    id: 6,
    name: 'Organic Bananas',
    price: 2.49,
    category: 'Fruits',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop',
    status: 'in-stock',
    description: 'Ripe organic bananas',
    sku: 'ORG-006',
    lastUpdated: '2024-03-12'
  },
  {
    id: 7,
    name: 'Organic Honey',
    price: 12.99,
    category: 'Pantry',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
    status: 'out-of-stock',
    description: 'Pure organic wildflower honey',
    sku: 'ORG-007',
    lastUpdated: '2024-03-10'
  },
  {
    id: 8,
    name: 'Organic Eggs',
    price: 7.99,
    category: 'Dairy',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=200&h=200&fit=crop',
    status: 'in-stock',
    description: 'Free-range organic eggs',
    sku: 'ORG-008',
    lastUpdated: '2024-03-13'
  }
];

export const mockStats = {
  inventoryValue: 15678.50,
  outOfStockItems: 2,
  newMessages: 5,
  totalProducts: 8,
  lowStockItems: 1,
  totalRevenue: 45678.90
};

export const mockCategories = [
  'All',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Leafy Greens',
  'Pantry'
];
