// Product types (from Inventory Service)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number; // Available stock
  skuCode?: string;
  imageUrl?: string; // URL to product image
  category?: string; // Product category for filtering
}

// Order types (from Order Service)
export interface OrderLineItem {
  id?: number;
  skuCode: string;
  price: number;
  quantity: number;
}

export interface Order {
  id?: number;
  orderNumber?: string;
  userId: string;
  status?: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
  lineItems?: OrderLineItem[];
  totalAmount?: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// Order request payload (matching backend expectations)
export interface OrderRequest {
  userId: string;
  productId: number;
  quantity: number;
  paymentMethodId?: string;
  paymentType: 'CARD' | 'UPI' | 'COD';
}

// Cart types (client-side)
export interface CartItem {
  product: Product;
  quantity: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Health check response
export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp?: string;
}

// User type (for future auth)
export interface User {
  id: string;
  username: string;
  email?: string;
  roles?: string[];
}
