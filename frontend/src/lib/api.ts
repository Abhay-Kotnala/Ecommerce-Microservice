import type { Product, Order, OrderRequest, HealthStatus, ApiResponse } from '@/types';

// API Base URL - configure via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Endpoints - easy to modify if backend paths differ
const ENDPOINTS = {
  // Inventory Service endpoints
  PRODUCTS: '/api/inventory',
  PRODUCT_BY_ID: (id: number) => `/api/inventory/${id}`,

  // Order Service endpoints
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id: number) => `/api/orders/${id}`,
  ORDERS_BY_USER: (userId: string) => `/api/orders?userId=${userId}`,

  // Health check
  HEALTH: '/actuator/health',

  // Payment Service endpoints
  PAYMENT: '/api/payment/create-payment-intent',
} as const;

// Get auth token from storage (oidc-client-ts stores it in sessionStorage by default)
function getAuthToken(): string | null {
  const oidcStorage = sessionStorage.getItem(`oidc.user:${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}:${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}`);
  if (oidcStorage) {
    const user = JSON.parse(oidcStorage);
    return user.access_token;
  }
  return null;
}

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add JWT token if available
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        error: errorText || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error('API Error:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

// ============ Inventory API ============

export async function fetchProducts(): Promise<ApiResponse<Product[]>> {
  return apiFetch<Product[]>(ENDPOINTS.PRODUCTS);
}

export async function fetchProductById(id: number): Promise<ApiResponse<Product>> {
  return apiFetch<Product>(ENDPOINTS.PRODUCT_BY_ID(id));
}

// ============ Order API ============

export async function createOrder(orderRequest: OrderRequest): Promise<ApiResponse<Order>> {
  return apiFetch<Order>(ENDPOINTS.ORDERS, {
    method: 'POST',
    body: JSON.stringify(orderRequest),
  });
}

export async function fetchOrdersByUser(userId: string): Promise<ApiResponse<Order[]>> {
  return apiFetch<Order[]>(ENDPOINTS.ORDERS_BY_USER(userId));
}

export async function fetchOrderById(id: number): Promise<ApiResponse<Order>> {
  return apiFetch<Order>(ENDPOINTS.ORDER_BY_ID(id));
}

// ============ Payment API ============

export async function createPaymentIntent(amount: number, currency: string, paymentMethodType: string): Promise<ApiResponse<{ clientSecret: string; paymentIntentId: string }>> {
  return apiFetch<{ clientSecret: string; paymentIntentId: string }>(ENDPOINTS.PAYMENT, {
    method: 'POST',
    body: JSON.stringify({ amount, currency, paymentMethodType }),
  });
}

// ============ Health Check API ============

export async function checkGatewayHealth(): Promise<ApiResponse<HealthStatus>> {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HEALTH}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      return { data: { status: 'UP', ...data }, status: response.status };
    }

    return { data: { status: 'DOWN' }, status: response.status };
  } catch {
    return { data: { status: 'DOWN' }, status: 0 };
  }
}

// Export endpoints for reference
export { API_BASE_URL, ENDPOINTS };
