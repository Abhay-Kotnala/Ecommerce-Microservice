Write-Host "Changing Keycloak username from 'john' to 'Abhay'..." -ForegroundColor Cyan

# Keycloak settings
$keycloakUrl = "http://localhost:8090"
$realm = "ecommerce"
$adminUser = "admin"
$adminPassword = "admin"

# 1. Get Admin Token
Write-Host "`n[Step 1/4] Getting admin access token..." -ForegroundColor Yellow
try {
    $tokenBody = @{
        grant_type = "password"
        client_id  = "admin-cli"
        username   = $adminUser
        password   = $adminPassword
    }
    
    $tokenResponse = Invoke-RestMethod -Uri "$keycloakUrl/realms/master/protocol/openid-connect/token" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body $tokenBody
    
    $accessToken = $tokenResponse.access_token
    Write-Host "✅ Got access token" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to get access token: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Get User 'john'
Write-Host "`n[Step 2/4] Finding user 'john'..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization  = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    
    $users = Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm/users?username=john" `
        -Method Get `
        -Headers $headers
    
    if ($users.Count -eq 0) {
        Write-Host "❌ User 'john' not found" -ForegroundColor Red
        exit 1
    }
    
    $user = $users[0]
    $userId = $user.id
    Write-Host "✅ Found user 'john' (ID: $userId)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to find user: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Update Username
Write-Host "`n[Step 3/4] Updating username to 'Abhay'..." -ForegroundColor Yellow
try {
    $user.username = "Abhay"
    $user.email = "abhay@example.com"
    $user.firstName = "Abhay"
    
    $userJson = $user | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm/users/$userId" `
        -Method Put `
        -Headers $headers `
        -Body $userJson | Out-Null
    
    Write-Host "✅ Username updated successfully!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to update username: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Verify
Write-Host "`n[Step 4/4] Verifying change..." -ForegroundColor Yellow
try {
    $updatedUser = Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm/users/$userId" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Verification successful!" -ForegroundColor Green
    Write-Host "   Username: $($updatedUser.username)" -ForegroundColor White
    Write-Host "   Email: $($updatedUser.email)" -ForegroundColor White
}
catch {
    Write-Host "⚠️  Could not verify: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ SUCCESS! Username changed to 'Abhay'" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host "`nLogin credentials:" -ForegroundColor Cyan
Write-Host "  Username: Abhay" -ForegroundColor White  
Write-Host "  Password: password123" -ForegroundColor White
Write-Host "`n💡 Refresh your app and login with 'Abhay'!" -ForegroundColor Yellow
