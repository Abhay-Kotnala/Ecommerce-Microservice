# 🔐 Keycloak Configuration Guide

## Prerequisites

Make sure Keycloak is running:
```powershell
# Stop existing containers and restart with Keycloak
docker-compose down
docker-compose up -d
```

Wait about 30 seconds for Keycloak to fully start, then verify:
```powershell
docker logs ecommerce-keycloak
```

---

## Step 1: Access Keycloak Admin Console

1. Open your browser
2. Go to: **http://localhost:8090**
3. Click **Administration Console**
4. Login with:
   - **Username:** `admin`
   - **Password:** `admin`

---

## Step 2: Create a New Realm

1. In the left sidebar, hover over **Master** (top-left dropdown)
2. Click **Create Realm**
3. Enter:
   - **Realm name:** `ecommerce`
4. Click **Create**

✅ You should now see `ecommerce` in the realm dropdown

---

## Step 3: Create Client for API Gateway

1. In the left sidebar, click **Clients**
2. Click **Create client**
3. **General Settings:**
   - **Client type:** `OpenID Connect`
   - **Client ID:** `ecommerce-gateway`
   - Click **Next**

4. **Capability config:**
   - **Client authentication:** `OFF` (for testing; use ON for production)
   - **Authorization:** `OFF`
   - **Authentication flow:**
     - ✅ **Standard flow**
     - ✅ **Direct access grants** (enable this!)
     - ❌ Implicit flow
     - ❌ Service accounts roles
   - Click **Next**

5. **Login settings:**
   - **Valid redirect URIs:** `http://localhost:8080/*`
   - **Valid post logout redirect URIs:** `http://localhost:8080/*`
   - **Web origins:** `http://localhost:8080`
   - Click **Save**

---

## Step 4: Configure Client Scopes (Map Roles to Token)

1. Go to **Clients** → Click `ecommerce-gateway`
2. Go to **Client scopes** tab
3. Click on `ecommerce-gateway-dedicated`
4. Click **Add mapper** → **By configuration**
5. Select **User Realm Role**
6. Configure:
   - **Name:** `realm-roles`
   - **Mapper type:** `User Realm Role`
   - **Token Claim Name:** `roles`
   - **Claim JSON Type:** `String`
   - ✅ **Add to ID token**
   - ✅ **Add to access token**
   - ✅ **Add to userinfo**
7. Click **Save**

---

## Step 5: Create Roles

1. In the left sidebar, click **Realm roles**
2. Click **Create role**
3. Create first role:
   - **Role name:** `ROLE_USER`
   - **Description:** `Regular user role - can place orders`
   - Click **Save**

4. Click **Create role** again
5. Create second role:
   - **Role name:** `ROLE_ADMIN`
   - **Description:** `Administrator role - full access`
   - Click **Save**

✅ You should now have 2 roles: `ROLE_USER` and `ROLE_ADMIN`

---

## Step 6: Create Test Users

### Create User "john" (Regular User)

1. In the left sidebar, click **Users**
2. Click **Add user**
3. Fill in:
   - **Username:** `john`
   - **Email:** `john@example.com` (optional)
   - **First name:** `John` (optional)
   - **Last name:** `Doe` (optional)
   - ✅ **Email verified:** `ON`
4. Click **Create**

5. Go to **Credentials** tab
6. Click **Set password**
7. Enter:
   - **Password:** `password123`
   - **Password confirmation:** `password123`
   - **Temporary:** `OFF` (important!)
8. Click **Save**

9. Go to **Role mapping** tab
10. Click **Assign role**
11. Select **ROLE_USER**
12. Click **Assign**

### Create User "admin" (Administrator)

1. Click **Users** in the left sidebar
2. Click **Add user**
3. Fill in:
   - **Username:** `admin`
   - **Email:** `admin@example.com`
   - ✅ **Email verified:** `ON`
4. Click **Create**

5. Go to **Credentials** tab
6. Set password:
   - **Password:** `admin123`
   - **Password confirmation:** `admin123`
   - **Temporary:** `OFF`
7. Click **Save**

8. Go to **Role mapping** tab
9. Click **Assign role**
10. Select **ROLE_ADMIN**
11. Click **Assign**

---

## ✅ Configuration Complete!

You should now have:
- ✅ Realm: `ecommerce`
- ✅ Client: `ecommerce-gateway`
- ✅ Roles: `ROLE_USER`, `ROLE_ADMIN`
- ✅ Users:
  - `john` / `password123` → ROLE_USER
  - `admin` / `admin123` → ROLE_ADMIN

---

## 🧪 Test Configuration

### Get Token for John (User)
```powershell
$body = @{
    grant_type = "password"
    client_id = "ecommerce-gateway"
    username = "john"
    password = "password123"
    scope = "openid"
}
$response = Invoke-RestMethod -Uri "http://localhost:8090/realms/ecommerce/protocol/openid-connect/token" -Method POST -Body $body
$userToken = $response.access_token
Write-Host "User Token: $userToken"
```

### Get Token for Admin
```powershell
$body = @{
    grant_type = "password"
    client_id = "ecommerce-gateway"
    username = "admin"
    password = "admin123"
    scope = "openid"
}
$response = Invoke-RestMethod -Uri "http://localhost:8090/realms/ecommerce/protocol/openid-connect/token" -Method POST -Body $body
$adminToken = $response.access_token
Write-Host "Admin Token: $adminToken"
```

### Verify Token Works
```powershell
# Test with user token
$headers = @{ Authorization = "Bearer $userToken" }
Invoke-RestMethod -Uri http://localhost:8080/api/orders -Headers $headers
```

If you get a response (not 401), it's working! ✅

---

## 🔍 Troubleshooting

**Problem:** Can't access Keycloak console
- Check if container is running: `docker ps | Select-String keycloak`
- Check logs: `docker logs ecommerce-keycloak`

**Problem:** Token request fails
- Verify realm name is exactly `ecommerce`
- Verify client ID is exactly `ecommerce-gateway`
- Verify "Direct access grants" is enabled in client settings

**Problem:** Token validation fails in API Gateway
- Check API Gateway logs for errors
- Verify `issuer-uri` in application.yml matches Keycloak realm
- Restart API Gateway after Keycloak is fully running
