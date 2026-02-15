# E-Commerce Microservices Frontend

A modern React frontend for the E-Commerce Microservices System built with Spring Boot.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at `http://localhost:5173` (or next available port).

## Configuration

### API Base URL

By default, the frontend connects to `http://localhost:8080` (API Gateway).

To change this, create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Backend Endpoints

If your backend uses different paths, update them in `src/lib/api.ts`:

```typescript
const ENDPOINTS = {
  PRODUCTS: '/api/inventory',           // GET all products
  PRODUCT_BY_ID: (id) => `/api/inventory/${id}`,  // GET single product
  ORDERS: '/api/orders',                 // POST create order
  ORDERS_BY_USER: (userId) => `/api/orders?userId=${userId}`,  // GET user orders
  HEALTH: '/actuator/health',            // Health check
};
```

## Features

- **Product Browsing**: Grid layout with search/filter
- **Product Details**: Quantity selector, stock validation
- **Shopping Cart**: Add/remove items, quantity updates
- **Checkout**: Order placement via Order Service
- **Order History**: View past orders
- **System Status**: Monitor microservices health

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ProductList.tsx
├── contexts/          # React contexts
│   ├── AuthContext.tsx   # Auth state (simulated)
│   └── CartContext.tsx   # Shopping cart
├── lib/
│   ├── api.ts        # API client
│   └── utils.ts
├── pages/            # Route components
│   ├── Index.tsx     # Product listing
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Orders.tsx
│   └── Status.tsx
└── types/
    └── index.ts      # TypeScript interfaces
```

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui (component library)
- React Router (navigation)
- TanStack Query (data fetching, future use)

## Authentication (Future)

The app is structured for easy OAuth2/Keycloak integration:

1. Auth context is ready at `src/contexts/AuthContext.tsx`
2. API client attaches JWT tokens automatically
3. Replace `login()`/`logout()` with real auth flow

## Backend Services

| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 8080 | Entry point, routing |
| Order Service | 8081 | Order management |
| Inventory Service | 8082 | Product catalog |
| Notification Service | 8083 | Emails via Kafka |
| Eureka | 8761 | Discovery (internal) |

## Deployment

Simply open Lovable and click on Share -> Publish.
