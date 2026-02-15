# 🧪 Resilience Patterns Testing Guide

## Quick Setup Steps

### 1. Reload Maven Dependencies in IDE

Since we added new dependencies, you need to reload them:

**IntelliJ IDEA:**
1. Right-click on each `pom.xml` (order-service, inventory-service, api-gateway)
2. Select **Maven → Reload Project**

Or use the Maven tool window:
1. Open **Maven** tool window (View → Tool Windows → Maven)
2. Click the **Reload All Maven Projects** button (circular arrows icon)

### 2. Restart All Services

Stop and restart each service in your IDE:
1. ✅ **Eureka Server**
2. ✅ **API Gateway**  
3. ✅ **Order Service**
4. ✅ **Inventory Service**
5. ✅ **Notification Service**

---

## Test 1: Circuit Breaker (Order Service)

### Test Scenario: Kafka Failure

**Step 1:** Stop Kafka to simulate event publishing failure:
```powershell
docker stop ecommerce-kafka
```

**Step 2:** Try to create an order:
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/orders -Method POST -ContentType "application/json" -Body '{"userId": "test", "productId": 1, "quantity": 1}'
```

**✅ Expected Result:**
- Order is created with status `PENDING`
- **Circuit breaker activated** - fallback method handles it gracefully
- Check Order Service logs for: `⚠️ Order X created in degraded mode (event publishing failed)`

**Step 3:** Check circuit breaker state via actuator:
```powershell
Invoke-RestMethod -Uri http://localhost:8081/actuator/circuitbreakers
```

**Expected:** Circuit breaker state shown as `OPEN` or `HALF_OPEN`

**Step 4:** Restart Kafka:
```powershell
docker start ecommerce-kafka
```

**Step 5:** Wait 10 seconds, then try creating another order:
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/orders -Method POST -ContentType "application/json" -Body '{"userId": "test2", "productId": 1, "quantity": 1}'
```

**✅ Expected:** Circuit breaker closes, order processes normally with events

---

## Test 2: Retry Mechanism (Order & Inventory Service)

### Test Scenario: Database Connection Failure

**Step 1:** Stop PostgreSQL temporarily:
```powershell
docker stop ecommerce-postgres
```

**Step 2:** Try to fetch an order:
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/orders/1
```

**✅ Expected Result:**
- Check **Order Service logs** - you should see **3 retry attempts**:
  ```
  Attempt 1 failed...
  Attempt 2 failed...
  Attempt 3 failed...
  Final failure after 3 retries
  ```
- Request eventually fails after retries exhausted

**Step 3:** Restart PostgreSQL:
```powershell
docker start ecommerce-postgres
```

**Step 4:** Wait 5 seconds for database to be ready, then try again:
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/orders/1
```

**✅ Expected:** Request succeeds immediately

---

## Test 3: Rate Limiting (API Gateway)

### Test Scenario: High Load

**Step 1:** Send 20 rapid requests to order endpoint:
```powershell
1..20 | ForEach-Object {
    Write-Host "Sending request #$_"
    try {
        Invoke-RestMethod -Uri http://localhost:8080/api/orders/1
        Write-Host "✅ Request $_ succeeded"
    } catch {
        Write-Host "❌ Request $_ failed: $($_.Exception.Message)"
    }
}
```

**✅ Expected Result:**
- **First 10-20 requests** succeed (within burst capacity)
- **Remaining requests** get **429 Too Many Requests** or delayed
- Requests slow down after rate limit hit

**Step 2:** Check actuator endpoints:
```powershell
# Check API Gateway health
Invoke-RestMethod -Uri http://localhost:8080/actuator/health
```

---

## Test 4: Verify Actuator Endpoints

### Order Service (Port 8081)
```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:8081/actuator/health

# Circuit breaker status
Invoke-RestMethod -Uri http://localhost:8081/actuator/circuitbreakers

# Circuit breaker events
Invoke-RestMethod -Uri http://localhost:8081/actuator/circuitbreakerevents
```

### Inventory Service (Port 8082)
```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:8082/actuator/health

# Metrics
Invoke-RestMethod -Uri http://localhost:8082/actuator/metrics
```

### API Gateway (Port 8080)
```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:8080/actuator/health

# Gateway routes
Invoke-RestMethod -Uri http://localhost:8080/actuator/gateway/routes
```

---

## ✅ Success Checklist

- [ ] Circuit breaker activates when Kafka is down
- [ ] Fallback method creates order in degraded mode
- [ ] Circuit breaker state visible in actuator
- [ ] Retry attempts visible in logs (3 attempts)
- [ ] Rate limiting kicks in after threshold
- [ ] 429 errors returned for rate-limited requests
- [ ] All actuator endpoints accessible
- [ ] Services recover when dependencies restart

---

## 🎯 What This Proves

1. **Fault Tolerance** - System continues operating during failures
2. **Circuit Breaker** - Prevents cascading failures
3. **Retry Logic** - Automatic recovery from transient failures
4. **Rate Limiting** - Protection from overload
5. **Observability** - Health checks and metrics exposed

---

## 💡 Quick Commands Reference

### Docker Container Management
```powershell
# Stop a service
docker stop ecommerce-kafka
docker stop ecommerce-postgres

# Start a service  
docker start ecommerce-kafka
docker start ecommerce-postgres

# Check running containers
docker ps
```

### Testing Commands
```powershell
# Create order
Invoke-RestMethod -Uri http://localhost:8080/api/orders -Method POST -ContentType "application/json" -Body '{"userId": "user1", "productId": 1, "quantity": 2}'

# Get order
Invoke-RestMethod -Uri http://localhost:8080/api/orders/1

# Check circuit breaker
Invoke-RestMethod -Uri http://localhost:8081/actuator/circuitbreakers
```

---

**🎉 Once all tests pass, you've successfully added production-grade resilience to your microservices!**
