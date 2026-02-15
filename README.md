# Distributed Commerce Platform

A production-grade, event-driven microservices architecture for E-Commerce built with Spring Boot and Spring Cloud.

## Architecture Overview

This system follows a microservices architecture pattern with:
- **Service Discovery** (Eureka)
- **API Gateway** (Spring Cloud Gateway)
- **Event-Driven Communication** (Apache Kafka)
- **Database per Service** (PostgreSQL)
- **Distributed Caching** (Redis)
- **Distributed Tracing** (Zipkin)

## Microservices

| Service | Port | Description |
|---------|------|-------------|
| Eureka Server | 8761 | Service registry and discovery |
| API Gateway | 8080 | Entry point, routing, JWT authentication |
| Order Service | 8081 | Order management and lifecycle |
| Inventory Service | 8082 | Stock management and reservation |
| Email Service | 8083 | Notification service (external) |

## Technology Stack

- **Java**: 17
- **Spring Boot**: 3.2.2
- **Spring Cloud**: 2023.0.0
- **Kafka**: Message broker for async communication
- **PostgreSQL**: Relational database
- **Redis**: Caching layer
- **Docker & Docker Compose**: Infrastructure orchestration

## Prerequisites

- Java 17+
- Maven 3.8+
- Docker & Docker Compose

## Quick Start (Local Development)

### 1. Pre-Flight Check (Clean Up)
Ensure no old processes are blocking ports (8761, 8080, 8081, etc.).
- Stop all running Docker containers: `docker stop $(docker ps -q)`
- Run cleanup script (if available): `.\kill-all-services.ps1`

### 2. Start Infrastructure (Docker)
Start **only** the infrastructure services (Database, Kafka, Redis, etc.):

```bash
docker-compose up -d zookeeper kafka postgres redis zipkin keycloak grafana loki
```
*(Wait ~30 seconds for these to initialize)*

### 3. Start Microservices (IntelliJ IDEA)
Start the Java applications in this **exact order**. Wait for one to fully start before the next.

1. **Eureka Server** (`EurekaServerApplication`) - Wait for startup!
2. **API Gateway** (`ApiGatewayApplication`) - Wait for startup!
3. **Inventory Service** (`InventoryServiceApplication`)
4. **Order Service** (`OrderServiceApplication`)
5. **Notification Service** (`NotificationServiceApplication`)

✅ **Verify:** http://localhost:8761/ (Eureka Dashboard)

### 4. Start Frontend
```bash
cd frontend
npm run dev
```
✅ **Open:** http://localhost:5173/

## Event Flow

```
Client -> API Gateway -> Order Service 
                            |
                            v (OrderPlacedEvent via Kafka)
                         Inventory Service
                            |
                            v (StockReservedEvent/StockFailedEvent)
                         Order Service
                            |
                            v (OrderConfirmedEvent)
                         Email Service
```

## Testing

### Add Product to Inventory

```bash
curl -X POST http://localhost:8080/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Gaming Laptop",
    "price": 1200.00,
    "stockQuantity": 10
  }'
```

### Place an Order

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "productId": 1,
    "quantity": 2
  }'
```

## Monitoring

- **Eureka Dashboard**: http://localhost:8761
- **Zipkin Tracing**: http://localhost:9411

## License

MIT

---
Created by **Abhay Kotnala**
