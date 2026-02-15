Write-Host "Enabling Keycloak User Registration..." -ForegroundColor Cyan

# Keycloak settings
$keycloakUrl = "http://localhost:8090"
$realm = "ecommerce"
$adminUser = "admin"
$adminPassword = "admin"

# 1. Get Admin Token
Write-Host "`n[Step 1/3] Getting admin access token..." -ForegroundColor Yellow
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

# 2. Get Current Realm Settings
Write-Host "`n[Step 2/3] Getting current realm settings..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization  = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    
    $realmSettings = Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Retrieved realm settings" -ForegroundColor Green
    Write-Host "   Current registration status: $($realmSettings.registrationAllowed)" -ForegroundColor White
}
catch {
    Write-Host "❌ Failed to get realm settings: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Enable Registration
Write-Host "`n[Step 3/3] Enabling user registration..." -ForegroundColor Yellow
try {
    # Update only the registration-related settings
    $realmSettings.registrationAllowed = $true
    $realmSettings.registrationEmailAsUsername = $false
    $realmSettings.resetPasswordAllowed = $true
    $realmSettings.verifyEmail = $false  # Set to true if you want email verification
    $realmSettings.loginWithEmailAllowed = $true
    
    $realmJson = $realmSettings | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm" `
        -Method Put `
        -Headers $headers `
        -Body $realmJson | Out-Null
    
    Write-Host "✅ User registration enabled!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to enable registration: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Verify
Write-Host "`n[Step 4/4] Verifying settings..." -ForegroundColor Yellow
try {
    $updatedRealm = Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/$realm" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Verification successful!" -ForegroundColor Green
    Write-Host "`n📋 Registration Settings:" -ForegroundColor Cyan
    Write-Host "   Registration Allowed: $($updatedRealm.registrationAllowed)" -ForegroundColor White
    Write-Host "   Email as Username: $($updatedRealm.registrationEmailAsUsername)" -ForegroundColor White
    Write-Host "   Reset Password Allowed: $($updatedRealm.resetPasswordAllowed)" -ForegroundColor White
    Write-Host "   Email Verification: $($updatedRealm.verifyEmail)" -ForegroundColor White
}
catch {
    Write-Host "⚠️  Could not verify: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ SUCCESS! User Registration is Now Enabled!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════" -ForegroundColor Green

Write-Host "`n📝 How Users Can Register:" -ForegroundColor Cyan
Write-Host "1. Go to your site: http://localhost:5173" -ForegroundColor White
Write-Host "2. Click 'Login' button in header" -ForegroundColor White
Write-Host "3. On Keycloak login page, click 'Register'" -ForegroundColor White
Write-Host "4. Fill in: Username, Email, Password" -ForegroundColor White
Write-Host "5. Submit → Account created! 🎉" -ForegroundColor White

Write-Host "`n💡 Test it now in an incognito window!" -ForegroundColor Yellow
