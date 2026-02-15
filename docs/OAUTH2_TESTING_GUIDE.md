# 🧪 OAuth2 Security Testing Guide

## Prerequisites

1. ✅ Keycloak is running (`docker ps | Select-String keycloak`)
2. ✅ Keycloak configured (see [keycloak_setup_guide.md](file:///C:/Users/abhay/.gemini/antigravity/brain/cb062dca-eb95-4e86-9f69-23a82af264ea/keycloak_setup_guide.md))
3. ✅ All microservices restarted (API Gateway, Order Service, Inventory Service)
4. ✅ Test data exists (at least one product in inventory)

---

## Setup: Get Tokens

Run these commands first to get JWT tokens:

### Get User Token (john - ROLE_USER)
```powershell
$userBody = @{
    grant_type = "password"
    client_id = "ecommerce-gateway"
    username = "john"
    password = "password123"
    scope = "openid"
}
$userResponse = Invoke-RestMethod -Uri "http://localhost:8090/realms/ecommerce/protocol/openid-connect/token" -Method POST -Body $userBody
$userToken = $userResponse.access_token
Write-Host "✅ User Token obtained" -ForegroundColor Green
```

### Get Admin Token (admin - ROLE_ADMIN)
```powershell
$adminBody = @{
    grant_type = "password"
    client_id = "ecommerce-gateway"
    username = "admin"
    password = "admin123"
    scope = "openid"
}
$adminResponse = Invoke-RestMethod -Uri "http://localhost:8090/realms/ecommerce/protocol/openid-connect/token" -Method POST -Body $adminBody
$adminToken = $adminResponse.access_token
Write-Host "✅ Admin Token obtained" -ForegroundColor Green
```

---

## Test 1: Unauthorized Access (No Token)

**Expected:** 401 Unauthorized

```powershell
try {
    Invoke-RestMethod -Uri http://localhost:8080/api/orders
    Write-Host "❌ FAIL: Should have been blocked" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ PASS: Correctly blocked (401)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL: Wrong error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
```

---

## Test 2: Valid Token - User Access to Orders

**Expected:** 200 OK - User can access orders

```powershell
try {
    $headers = @{ Authorization = "Bearer $userToken" }
    $result = Invoke-RestMethod -Uri http://localhost:8080/api/orders -Headers $headers
    Write-Host "✅ PASS: User accessed orders successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ FAIL: User should be able to access orders. Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

## Test 3: User Creating Order (Authorized)

**Expected:** 200 OK - User can place orders

```powershell
try {
    $headers = @{ 
        Authorization = "Bearer $userToken"
        "Content-Type" = "application/json"
    }
    $body = '{"userId": "john", "productId": 1, "quantity": 1}'
    $result = Invoke-RestMethod -Uri http://localhost:8080/api/orders -Method POST -Headers $headers -Body $body
    Write-Host "✅ PASS: User placed order successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ FAIL: User should be able to place orders. Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

## Test 4: User Accessing Inventory (Read) - Authorized

**Expected:** 200 OK - User can view inventory

```powershell
try {
    $headers = @{ Authorization = "Bearer $userToken" }
    $result = Invoke-RestMethod -Uri http://localhost:8080/api/inventory -Headers $headers
    Write-Host "✅ PASS: User viewed inventory successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ FAIL: User should be able to view inventory. Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

## Test 5: User Creating Product (FORBIDDEN)

**Expected:** 403 Forbidden - Only admins can create products

```powershell
try {
    $headers = @{ 
        Authorization = "Bearer $userToken"
        "Content-Type" = "application/json"
    }
    $body = '{"name": "Test Product", "description": "Test", "price": 100.00, "stockQuantity": 10}'
    Invoke-RestMethod -Uri http://localhost:8080/api/inventory -Method POST -Headers $headers -Body $body
    Write-Host "❌ FAIL: User should NOT be able to create products" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "✅ PASS: Correctly blocked (403 Forbidden)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL: Wrong error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
```

---

## Test 6: Admin Creating Product (Authorized)

**Expected:** 200 OK - Admin can create products

```powershell
try {
    $headers = @{ 
        Authorization = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    $body = '{"name": "Admin Product", "description": "Created by admin", "price": 99.99, "stockQuantity": 50}'
    $result = Invoke-RestMethod -Uri http://localhost:8080/api/inventory -Method POST -Headers $headers -Body $body
    Write-Host "✅ PASS: Admin created product successfully" -ForegroundColor Green
    Write-Host "Product ID: $($result.id)"
} catch {
    Write-Host "❌ FAIL: Admin should be able to create products. Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

## Test 7: Admin Accessing Orders (Authorized)

**Expected:** 200 OK - Admin has access to everything

```powershell
try {
    $headers = @{ Authorization = "Bearer $adminToken" }
    $result = Invoke-RestMethod -Uri http://localhost:8080/api/orders -Headers $headers
    Write-Host "✅ PASS: Admin accessed orders successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ FAIL: Admin should have full access. Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

## Test 8: Invalid/Expired Token

**Expected:** 401 Unauthorized

```powershell
try {
    $headers = @{ Authorization = "Bearer invalid.token.here" }
    Invoke-RestMethod -Uri http://localhost:8080/api/orders -Headers $headers
    Write-Host "❌ FAIL: Invalid token should be rejected" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ PASS: Invalid token correctly rejected (401)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL: Wrong error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
```

---

## ✅ Success Criteria

All tests should show ✅ PASS:
- [ ] Test 1: Unauthorized access blocked (401)
- [ ] Test 2: User can access orders
- [ ] Test 3: User can create orders
- [ ] Test 4: User can view inventory
- [ ] Test 5: User CANNOT create products (403)
- [ ] Test 6: Admin CAN create products
- [ ] Test 7: Admin can access orders
- [ ] Test 8: Invalid token rejected (401)

---

## 🔍 Troubleshooting

**Problem:** All requests return 401
- Keycloak might not be fully started. Wait 30 seconds and restart API Gateway
- Check API Gateway logs for JWT validation errors
- Verify `issuer-uri` in API Gateway application.yml

**Problem:** Tokens work but roles don't (all 403)
- Verify role mapper is configured in Keycloak client scopes
- Check that roles in token use "SCOPE_ROLE_" prefix (this is Spring Security convention)
- Decode JWT at https://jwt.io to verify roles are in token

**Problem:** Can't get token from Keycloak
- Verify "Direct access grants" is enabled in Keycloak client
- Verify username/password are correct
- Check Keycloak logs: `docker logs ecommerce-keycloak`

---

## 📝 Quick Reference

### Authorization Rules:
- **GET /api/orders/\*\*** → ROLE_USER or ROLE_ADMIN
- **POST /api/orders/\*\*** → ROLE_USER or ROLE_ADMIN
- **GET /api/inventory/\*\*** → ROLE_USER or ROLE_ADMIN
- **POST /api/inventory/\*\*** → ROLE_ADMIN only
- **PUT /api/inventory/\*\*** → ROLE_ADMIN only
- **DELETE /api/inventory/\*\*** → ROLE_ADMIN only

### Test Users:
- **john** / **password123** → ROLE_USER
- **admin** / **admin123** → ROLE_ADMIN
