<#
.SYNOPSIS
    Automates Keycloak configuration for E-Commerce Microservices.
.DESCRIPTION
    Creates 'ecommerce' realm, 'ecommerce-gateway' client, roles, and users using kcadm.sh.
.NOTES
    Requires 'ecommerce-keycloak' container to be running.
#>

$ContainerName = "ecommerce-keycloak"
$KeycloakBin = "/opt/keycloak/bin/kcadm.sh"

function Run-Kcadm {
    param([string]$Command)
    # Write-Host "DEBUG: Executing $Command"
    docker exec $ContainerName /bin/bash -c "$KeycloakBin $Command"
}

Write-Host "🔐 Starting Keycloak Configuration..." -ForegroundColor Cyan

# 1. Authenticate
Write-Host "➡️ Authenticating..."
Run-Kcadm "config credentials --server http://localhost:8080 --realm master --user admin --password admin"

# 2. Create Realm
Write-Host "➡️ Creating Realm 'ecommerce'..."
Run-Kcadm "create realms -s realm=ecommerce -s enabled=true"

# 3. Create Client
# Using backtick to escape double quotes for PowerShell
Write-Host "➡️ Creating Client 'ecommerce-gateway'..."
Run-Kcadm "create clients -r ecommerce -s clientId=ecommerce-gateway -s enabled=true -s clientAuthenticatorType=client-secret -s secret=secret -s directAccessGrantsEnabled=true -s standardFlowEnabled=true -s publicClient=true -s 'redirectUris=[`"http://localhost:8085/*`", `"http://localhost:3001/*`"]' -s 'webOrigins=[`"http://localhost:8085`", `"http://localhost:3001`"]'"

# 4. Create Roles
Write-Host "➡️ Creating Roles..."
Run-Kcadm "create roles -r ecommerce -s name=ROLE_USER -s 'description=Regular user'"
Run-Kcadm "create roles -r ecommerce -s name=ROLE_ADMIN -s 'description=Administrator'"

# 5. Create Users
Write-Host "➡️ Creating Users..."
# John (User)
Run-Kcadm "create users -r ecommerce -s username=john -s enabled=true -s email=john@example.com -s emailVerified=true"
Run-Kcadm "set-password -r ecommerce --username john --new-password password123"
Run-Kcadm "add-roles -r ecommerce --uusername john --rolename ROLE_USER"

# Admin (Admin)
Run-Kcadm "create users -r ecommerce -s username=admin -s enabled=true -s email=admin@example.com -s emailVerified=true"
Run-Kcadm "set-password -r ecommerce --username admin --new-password admin123"
Run-Kcadm "add-roles -r ecommerce --uusername admin --rolename ROLE_ADMIN"

# 6. Configure Protocol Mapper (Roles in Token)
Write-Host "➡️ Configuring Role Mapper..."
# Get ID of the client scope
$ClientScopeId = (docker exec $ContainerName /bin/bash -c "$KeycloakBin get client-scopes -r ecommerce -q name=ecommerce-gateway-dedicated --fields id --format csv --noquotes")

if (-not $ClientScopeId) {
    Write-Error "Failed to get Client Scope ID"
    exit 1
}

# Create mapper
Run-Kcadm "create client-scopes/$ClientScopeId/protocol-mappers-models -r ecommerce -s name=realm-roles -s protocol=openid-connect -s protocolMapper=oidc-usermodel-realm-role-mapper -s 'config.`"id.token.claim`"=true' -s 'config.`"access.token.claim`"=true' -s 'config.`"userinfo.token.claim`"=true' -s 'config.`"claim.name`"=roles' -s 'config.`"jsonType.label`"=String'"

Write-Host "✅ Keycloak Configuration Complete!" -ForegroundColor Green
Write-Host "Test User: john / password123"
Write-Host "Test Admin: admin / admin123"
