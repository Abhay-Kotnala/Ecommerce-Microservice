<#
.SYNOPSIS
    Verifies OAuth2 security for the E-Commerce Microservices.
.DESCRIPTION
    Tests public and protected endpoints to ensure security is enforced.
#>

$GatewayUrl = "http://localhost:8085"
$KeycloakUrl = "http://localhost:8090"
$Realm = "ecommerce"
$Client = "ecommerce-gateway"

function Test-Endpoint {
    param($Url, $Method = "GET", $Token = $null, $ExpectedStatus)
    
    $Headers = @{}
    if ($Token) { $Headers["Authorization"] = "Bearer $Token" }
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -ErrorAction Stop
        $status = 200
        # If we get here, status is 200-299
    }
    catch {
        if ($_.Exception.Response) {
            $status = $_.Exception.Response.StatusCode.value__
        }
        else {
            $status = 500
            Write-Host "Error: $($_.Exception.Message)"
        }
    }

    if ($status -eq $ExpectedStatus) {
        Write-Host "[PASS] [$status] $Method $Url" -ForegroundColor Green
    }
    else {
        Write-Host "[FAIL] [$status] $Method $Url (Expected $ExpectedStatus)" -ForegroundColor Red
    }
}

Write-Host "Starting Security Verification..." -ForegroundColor Cyan

# 1. Get Access Token (User John)
Write-Host "`n[1] Authenticating as 'john'..."
$body = @{
    grant_type = "password"
    client_id  = $Client
    username   = "john"
    password   = "password123"
    scope      = "openid"
}
try {
    $tokenResponse = Invoke-RestMethod -Uri "$KeycloakUrl/realms/$Realm/protocol/openid-connect/token" -Method POST -Body $body
    $Token = $tokenResponse.access_token
    Write-Host "[PASS] Token acquired!" -ForegroundColor Green
}
catch {
    Write-Error "Failed to get token: $($_.Exception.Message)"
    exit 1
}

# 2. Test Protected Endpoint WITHOUT Token (Should Fail 401)
Write-Host "`n[2] Testing Protected Endpoint (No Token)..."
Test-Endpoint -Url "$GatewayUrl/api/orders" -ExpectedStatus 401

# 3. Test Protected Endpoint WITH Token (Should Succeed 200 or 404/empty)
Write-Host "`n[3] Testing Protected Endpoint (With Token)..."
Test-Endpoint -Url "$GatewayUrl/api/orders" -Token $Token -ExpectedStatus 200

# 4. Test Public Endpoint (Should Succeed 200)
# Testing inventory as public/accessible
Write-Host "`n[4] Testing Inventory Endpoint..."
Test-Endpoint -Url "$GatewayUrl/api/inventory" -Token $Token -ExpectedStatus 200

Write-Host "`nVerification Complete!"
