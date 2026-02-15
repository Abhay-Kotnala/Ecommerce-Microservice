#!/bin/bash

# Keycloak Configuration Script
# Executed INSIDE the container

KCADM="/opt/keycloak/bin/kcadm.sh"

echo "🔐 Starting Keycloak Configuration..."

# 1. Authenticate
$KCADM config credentials --server http://localhost:8080 --realm master --user admin --password admin

# 2. Create Realm (if not exists checks are implicit or it will fail/warn)
echo "➡️ Creating/Updating Realm 'ecommerce'..."
if $KCADM get realms/ecommerce >/dev/null 2>&1; then
    echo "Realm 'ecommerce' already exists. Skipping creation."
else
    $KCADM create realms -s realm=ecommerce -s enabled=true
fi

# 3. Create Client 'ecommerce-client' (MATCHING FRONTEND)
echo "➡️ Creating Client 'ecommerce-client'..."
# Check if exists
if $KCADM get clients -r ecommerce -q clientId=ecommerce-client | grep "ecommerce-client" >/dev/null; then
    echo "Client 'ecommerce-client' already exists. Updating configuration..."
    # Get ID
    CLIENT_UUID=$($KCADM get clients -r ecommerce -q clientId=ecommerce-client --fields id --format csv --noquotes)
    
    $KCADM update clients/$CLIENT_UUID -r ecommerce \
      -s enabled=true \
      -s publicClient=true \
      -s directAccessGrantsEnabled=true \
      -s standardFlowEnabled=true \
      -s 'redirectUris=["http://localhost:5173/*", "http://127.0.0.1:5173/*", "http://localhost:8085/*"]' \
      -s 'webOrigins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8085"]' \
      -s fullScopeAllowed=true
else
    $KCADM create clients -r ecommerce -s clientId=ecommerce-client -s enabled=true \
      -s publicClient=true \
      -s directAccessGrantsEnabled=true \
      -s standardFlowEnabled=true \
      -s 'redirectUris=["http://localhost:5173/*", "http://127.0.0.1:5173/*", "http://localhost:8085/*"]' \
      -s 'webOrigins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8085"]' \
      -s fullScopeAllowed=true
fi


# 4. Create Roles
echo "➡️ Creating Roles..."
$KCADM create roles -r ecommerce -s name=ROLE_USER -s 'description=Regular user' 2>/dev/null || true
$KCADM create roles -r ecommerce -s name=ROLE_ADMIN -s 'description=Administrator' 2>/dev/null || true

# 5. Create Users
echo "➡️ Creating Users..."
# John (User)
if $KCADM get users -r ecommerce -q username=john | grep "john" >/dev/null; then
    echo "User 'john' already exists."
else
    $KCADM create users -r ecommerce -s username=john -s enabled=true -s email=john@example.com -s emailVerified=true
    $KCADM set-password -r ecommerce --username john --new-password password123
    $KCADM add-roles -r ecommerce --uusername john --rolename ROLE_USER
fi

echo "✅ Keycloak Configuration Complete!"
