# 🧪 Complete Testing Guide - E-Commerce Microservices System

**End-to-End Testing: Infrastructure → Notification Service**

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Docker Desktop** installed and running
- **Java 17+** installed
- **Maven** installed
- Your IDE (IntelliJ IDEA / Eclipse) ready

---

## 🚀 Phase 1: Infrastructure Setup

### Step 1: Start Docker Infrastructure

Open PowerShell in the project root directory and run:

```powershell
docker-compose up -d
```

### ✅ Verify Docker Containers

Check all containers are running:

```powershell
docker ps
```

**Expected Output:** You should see 5 running containers:
- `ecommerce-zookeeper` (Port 2181)
- `ecommerce-kafka` (Port 9092)
- `ecommerce-postgres` (Port 5432)
- `ecommerce-redis` (Port 6379)
- `ecommerce-zipkin` (Port 9411)

### 🔍 Verify Individual Services

**Test Zipkin:**
- Open browser: **http://localhost:9411**
- You should see the Zipkin UI

**Test PostgreSQL:**
```powershell
docker exec -it ecommerce-postgres psql -U postgres -c "\l"
```
Expected: Should list `orderdb` and `inventorydb`

---

## 🎯 Phase 2: Start Microservices

Start services in this **specific order**:

### Step 2: Start Eureka Server

1. Navigate to: `eureka-server/src/main/java/com/ecommerce/eureka/EurekaServerApplication.java`
2. Right-click → **Run 'EurekaServerApplication'**
3. Wait for: `"Started EurekaServerApplication in X seconds"`

**✅ Verify:**
- Open browser: **http://localhost:8761**
- Eureka Dashboard should load (no instances yet)

---

### Step 3: Start API Gateway

1. Navigate to: `api-gateway/src/main/java/com/ecommerce/gateway/ApiGatewayApplication.java`
2. Right-click → **Run 'ApiGatewayApplication'**
3. Wait for: `"Started ApiGatewayApplication in X seconds"`

**✅ Verify:**
- Check Eureka Dashboard
- **API-GATEWAY** should appear under "Instances currently registered with Eureka"

---

### Step 4: Start Inventory Service

1. Navigate to: `inventory-service/src/main/java/com/ecommerce/inventory/InventoryServiceApplication.java`
2. Right-click → **Run 'InventoryServiceApplication'**
3. Wait for: `"Started InventoryServiceApplication in X seconds"`

**✅ Verify:**
- Check Eureka Dashboard
- **INVENTORY-SERVICE** should now be registered (Port 8082)

---

### Step 5: Start Order Service

1. Navigate to: `order-service/src/main/java/com/ecommerce/order/OrderServiceApplication.java`
2. Right-click → **Run 'OrderServiceApplication'**
3. Wait for: `"Started OrderServiceApplication in X seconds"`

**✅ Verify:**
- Check Eureka Dashboard
- **ORDER-SERVICE** should now be registered (Port 8081)

---

### Step 6: Start Notification Service

1. Navigate to: `notification-service/src/main/java/com/ecommerce/notification/NotificationServiceApplication.java`
2. Right-click → **Run 'NotificationServiceApplication'**
3. Wait for: `"Started NotificationServiceApplication in X seconds"`

**✅ Verify Eureka Dashboard:**
Open **http://localhost:8761** - You should see **ALL 4 SERVICES**:
- ✅ **API-GATEWAY** (Port 8080)
- ✅ **ORDER-SERVICE** (Port 8081)
- ✅ **INVENTORY-SERVICE** (Port 8082)
- ✅ **NOTIFICATION-SERVICE** (Port 8083)

📸 **Take a screenshot - all services are UP!**

---

## 🧪 Phase 3: Functional Testing

### Test 1: Add Product to Inventory

**Using PowerShell:**
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/inventory -Method POST -ContentType "application/json" -Body '{"name": "Gaming Laptop", "description": "High-performance laptop with RTX 4090", "price": 1500.00, "stockQuantity": 10}'
```

**Using cURL:**
```bash
curl -X POST http://localhost:8080/api/inventory \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Gaming Laptop\", \"description\": \"High-performance laptop with RTX 4090\", \"price\": 1500.00, \"stockQuantity\": 10}"
```

**✅ Expected Response:**
```json
{
  "id": 1,
  "name": "Gaming Laptop",
  "description": "High-performance laptop with RTX 4090",
  "price": 1500.00,
  "stockQuantity": 10,
  "createdAt": "2026-02-07T...",
  "updatedAt": "2026-02-07T..."
}
```

**✨ Note the `id: 1` - you'll need it for the next tests!**

---

### Test 2: Place an Order (Triggers Notification!)

**Using PowerShell:**
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/orders -Method POST -ContentType "application/json" -Body '{"userId": "user123", "productId": 1, "quantity": 2}'
```

**Using cURL:**
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"user123\", \"productId\": 1, \"quantity\": 2}"
```

**✅ Expected Response:**
```json
{
  "id": 1,
  "userId": "user123",
  "productId": 1,
  "quantity": 2,
  "totalPrice": 3000.00,
  "status": "PENDING",
  "createdAt": "2026-02-07T...",
  "updatedAt": "2026-02-07T..."
}
```

**⏳ Status is `PENDING` initially - this is correct!**

---

### Test 3: Verify Event Flow in Service Logs

**🔍 Immediately check your IDE console logs:**

#### Order Service Logs Should Show:
```
📦 Order created with ID: 1
📤 Published OrderPlacedEvent for order: 1
📥 Received StockReservedEvent for order: 1
✅ Order 1 confirmed
```

#### Inventory Service Logs Should Show:
```
📥 Received OrderPlacedEvent: OrderPlacedEvent{orderId=1, productId=1, quantity=2}
🔄 Processing order 1 for product 1 with quantity 2
✅ Successfully reserved 2 units of product 1 for order 1
📤 Published StockReservedEvent for order: 1
```

#### **Notification Service Logs Should Show:** ⭐
```
📧 Received OrderPlacedEvent for Order ID: 1
✅ Sending email to user with logic: [Simulating Email Sent...]
```

**🎉 If you see the notification log, the notification service is working!**

---

### Test 4: Verify Order Status Changed to CONFIRMED

**Wait 2-3 seconds** after placing the order, then fetch the order:

**Using PowerShell:**
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/orders/1
```

**Using cURL:**
```bash
curl http://localhost:8080/api/orders/1
```

**✅ Expected Response:**
```json
{
  "id": 1,
  "userId": "user123",
  "productId": 1,
  "quantity": 2,
  "totalPrice": 3000.00,
  "status": "CONFIRMED",  ← Should now be CONFIRMED!
  ...
}
```

**🎯 Success! Event-driven order confirmation is working!**

---

### Test 5: Verify Stock Deduction

**Using PowerShell:**
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/inventory/1
```

**Using cURL:**
```bash
curl http://localhost:8080/api/inventory/1
```

**✅ Expected Response:**
```json
{
  "id": 1,
  "name": "Gaming Laptop",
  "stockQuantity": 8,  ← Should be 8 (10 - 2)
  "price": 1500.00,
  ...
}
```

**✅ Stock deduction is working correctly!**

---

### Test 6: Failure Scenario (Insufficient Stock)

Test what happens when there's not enough stock:

**Using PowerShell:**
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/orders -Method POST -ContentType "application/json" -Body '{"userId": "user456", "productId": 1, "quantity": 100}'
```

**Expected Flow:**
1. Order created with status `PENDING`
2. Wait 2-3 seconds
3. Check order status:
   ```powershell
   Invoke-RestMethod -Uri http://localhost:8080/api/orders/2
   ```
4. Status should be `FAILED` (only 8 units available)

**Inventory Service Logs Should Show:**
```
⚠️ Insufficient stock for product 1. Available: 8, Requested: 100
📤 Published StockFailedEvent for order: 2
```

**Order Service Logs Should Show:**
```
📥 Received StockFailedEvent for order: 2
❌ Order 2 marked as FAILED
```

**✅ Failure handling is working!**

---

## 📊 Phase 4: Verify Distributed Tracing

### Step 7: View Request Traces in Zipkin

1. Open Zipkin: **http://localhost:9411**
2. Click **"Run Query"**
3. Click on any trace to view details

**Expected Trace Flow:**
```
API Gateway → Order Service → [Kafka: order-placed event]
                           → Inventory Service
                           → Notification Service
```

You should see:
- Request routing through the gateway
- Service-to-service communication
- Kafka event processing times
- Total request duration

---

## ✅ Final Success Checklist

Mark each as you complete:

- [ ] ✅ All 5 Docker containers running (Kafka, Zookeeper, PostgreSQL, Redis, Zipkin)
- [ ] ✅ All 4 microservices registered in Eureka
- [ ] ✅ Product successfully created
- [ ] ✅ Order successfully placed
- [ ] ✅ **Notification service received event and logged email send**
- [ ] ✅ Order status changed from PENDING → CONFIRMED
- [ ] ✅ Stock reduced from 10 → 8
- [ ] ✅ Order failed when insufficient stock
- [ ] ✅ Traces visible in Zipkin

---

## 🎯 What You've Verified

By completing this guide, you've tested:

1. **Infrastructure Layer:**
   - Docker containerization
   - Kafka event streaming
   - PostgreSQL databases
   - Redis caching
   - Zipkin tracing

2. **Service Discovery:**
   - Eureka server registration
   - Service-to-service discovery

3. **API Gateway:**
   - Request routing
   - Load balancing

4. **Business Logic:**
   - Order creation
   - Inventory management
   - Stock reservations

5. **Event-Driven Architecture:**
   - Kafka event publishing
   - Kafka event consumption
   - **Notification service event handling** ⭐

6. **Data Consistency:**
   - Database transactions
   - Pessimistic locking

7. **Observability:**
   - Distributed tracing
   - Service logs

---

## 💡 Quick Testing Commands Reference

### PowerShell Commands

```powershell
# Check Docker containers
docker ps

# Add Product
Invoke-RestMethod -Uri http://localhost:8080/api/inventory -Method POST -ContentType "application/json" -Body '{"name": "Gaming Laptop", "description": "RTX 4090", "price": 1500.00, "stockQuantity": 10}'

# Create Order
Invoke-RestMethod -Uri http://localhost:8080/api/orders -Method POST -ContentType "application/json" -Body '{"userId": "user123", "productId": 1, "quantity": 2}'

# Get Order
Invoke-RestMethod -Uri http://localhost:8080/api/orders/1

# Get Inventory
Invoke-RestMethod -Uri http://localhost:8080/api/inventory/1

# Stop all Docker containers
docker-compose down
```

---

## 🐛 Troubleshooting

### Issue: Services not registering with Eureka
**Solution:** Ensure Eureka Server started first and is accessible at http://localhost:8761

### Issue: Kafka connection errors
**Solution:** Verify Kafka container is running:
```powershell
docker logs ecommerce-kafka
```

### Issue: Database connection errors
**Solution:** Check PostgreSQL is running and databases exist:
```powershell
docker exec -it ecommerce-postgres psql -U postgres -c "\l"
```

### Issue: Port already in use
**Solution:** Find and stop the process using the port:
```powershell
# Find process on port (e.g., 8080)
netstat -ano | findstr :8080

# Stop process by PID
taskkill /PID <PID> /F
```

---

**🎉 Congratulations! You've successfully tested the complete E-Commerce Microservices System including the Notification Service!**
