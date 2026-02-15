# Keycloak Setup Script
$adminBody = @{
    grant_type = "password"
    client_id  = "admin-cli"
    username   = "admin"
    password   = "admin"
}
$tokenResponse = Invoke-RestMethod -Uri "http://localhost:8090/realms/master/protocol/openid-connect/token" -Method POST -Body $adminBody
$adminToken = $tokenResponse.access_token
Write-Host "Got Admin Token: $adminToken"
$keycloakUrl = "http://localhost:8090"
$realm = "ecommerce"

# Headers
$headers = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type"  = "application/json"
}

# 1. Create Realm
Write-Host "Creating Realm '$realm'..."
$realmBody = @{
    id      = $realm
    realm   = $realm
    enabled = $true
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$keycloakUrl/admin/realms" -Method POST -Headers $headers -Body $realmBody
    Write-Host "✅ Realm created." -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Realm might already exist or error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 2. Create Client
Write-Host "Creating Client 'ecommerce-gateway'..."
$clientBody = @{
    clientId                  = "ecommerce-gateway"
    enabled                   = $true
    publicClient              = $false
    bearerOnly                = $false
    directAccessGrantsEnabled = $true
    standardFlowEnabled       = $true
    redirectUris              = @("http://localhost:8085/*")
    webOrigins                = @("http://localhost:8085")
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm/clients" -Method POST -Headers $headers -Body $clientBody
    Write-Host "✅ Client created." -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Client might already exist: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 3. Create Roles
Function Create-Role ($roleName) {
    Write-Host "Creating Role '$roleName'..."
    $roleBody = @{
        name = $roleName
    } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm/roles" -Method POST -Headers $headers -Body $roleBody
        Write-Host "✅ Role '$roleName' created." -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Role '$roleName' might already exist: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
Create-Role "ROLE_USER"
Create-Role "ROLE_ADMIN"

# 4. Create User 'john'
Write-Host "Creating User 'john'..."
$userBody = @{
    username      = "john"
    enabled       = $true
    email         = "john@example.com"
    emailVerified = $true
    credentials   = @(
        @{
            type      = "password"
            value     = "password123"
            temporary = $false
        }
    )
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm/users" -Method POST -Headers $headers -Body $userBody
    Write-Host "✅ User 'john' created." -ForegroundColor Green
}
catch {
    Write-Host "⚠️ User 'john' might already exist: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 5. Assign Role to 'john' (Need User ID and Role ID)
# Fetch User ID
$user = Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm/users?username=john" -Headers $headers
$userId = $user[0].id

# Fetch Role ID
$role = Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm/roles/ROLE_USER" -Headers $headers
$roleId = $role.id
$roleName = $role.name

if ($userId -and $roleId) {
    Write-Host "Assigning ROLE_USER to john..."
    $roleMappingBody = @(
        @{
            id   = $roleId
            name = $roleName
        }
    ) | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm/users/$userId/role-mappings/realm" -Method POST -Headers $headers -Body $roleMappingBody
        Write-Host "✅ Role assigned." -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Failed to assign role: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
