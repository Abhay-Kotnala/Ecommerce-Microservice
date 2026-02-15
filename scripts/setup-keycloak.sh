#!/bin/bash

# Keycloak Configuration Script
# Executed INSIDE the container

KCADM="/opt/keycloak/bin/kcadm.sh"

echo "🔐 Starting Keycloak Configuration..."

# 1. Authenticate
$KCADM config credentials --server http://localhost:8080 --realm master --user admin --password admin

# 2. Create Realm
echo "➡️ Creating Realm 'ecommerce'..."
$KCADM create realms -s realm=ecommerce -s enabled=true

# 3. Create Client
echo "➡️ Creating Client 'ecommerce-gateway'..."
$KCADM create clients -r ecommerce -s clientId=ecommerce-gateway -s enabled=true \
  -s clientAuthenticatorType=client-secret -s secret=secret \
  -s directAccessGrantsEnabled=true -s standardFlowEnabled=true -s publicClient=true \
  -s 'redirectUris=["http://localhost:8085/*", "http://localhost:3001/*"]' \
  -s 'webOrigins=["http://localhost:8085", "http://localhost:3001"]'

# 4. Create Roles
echo "➡️ Creating Roles..."
$KCADM create roles -r ecommerce -s name=ROLE_USER -s 'description=Regular user'
$KCADM create roles -r ecommerce -s name=ROLE_ADMIN -s 'description=Administrator'

# 5. Create Users
echo "➡️ Creating Users..."
# John (User)
$KCADM create users -r ecommerce -s username=john -s enabled=true -s email=john@example.com -s emailVerified=true
$KCADM set-password -r ecommerce --username john --new-password password123
$KCADM add-roles -r ecommerce --uusername john --rolename ROLE_USER

# Admin (Admin)
$KCADM create users -r ecommerce -s username=admin -s enabled=true -s email=admin@example.com -s emailVerified=true
$KCADM set-password -r ecommerce --username admin --new-password admin123
$KCADM add-roles -r ecommerce --uusername admin --rolename ROLE_ADMIN

# 6. Configure Protocol Mapper (Roles in Token)
echo "➡️ Configuring Role Mapper..."
CLIENT_SCOPE_ID=$($KCADM get client-scopes -r ecommerce -q name=ecommerce-gateway-dedicated --fields id --format csv --noquotes)

$KCADM create client-scopes/$CLIENT_SCOPE_ID/protocol-mappers-models -r ecommerce \
  -s name=realm-roles -s protocol=openid-connect -s protocolMapper=oidc-usermodel-realm-role-mapper \
  -s 'config."id.token.claim"=true' \
  -s 'config."access.token.claim"=true' \
  -s 'config."userinfo.token.claim"=true' \
  -s 'config."claim.name"=roles' \
  -s 'config."jsonType.label"=String'

echo "✅ Keycloak Configuration Complete!"
