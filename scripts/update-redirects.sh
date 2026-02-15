#!/bin/bash
KCADM="/opt/keycloak/bin/kcadm.sh"

echo "🔐 Updating Keycloak Redirect URIs..."

# 1. Authenticate
$KCADM config credentials --server http://localhost:8080 --realm master --user admin --password admin

# 2. Update Client with explicit Redirect URIs
echo "➡️ Updating Client 'ecommerce-gateway'..."
$KCADM update clients -r ecommerce -q clientId=ecommerce-gateway \
  -s 'redirectUris=["http://localhost:8085/*", "http://localhost:3001/*", "http://localhost:3001", "http://localhost:3001/"]' \
  -s 'webOrigins=["http://localhost:8085", "http://localhost:3001"]'

echo "✅ Keycloak Redirect URIs Updated!"
