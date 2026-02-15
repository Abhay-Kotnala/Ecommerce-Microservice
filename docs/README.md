# 📚 Documentation Index

Welcome to the Distributed Commerce Platform documentation!

## 📖 Quick Start Guides

### Initial Setup & Docker Run
7. **[DOCKER_WALKTHROUGH.md](./DOCKER_WALKTHROUGH.md)** - How to run the entire system with Docker Compose
8. **[IMPORT_GUIDE.md](../IMPORT_GUIDE.md)** - How to import the project in IntelliJ IDEA
9. **[TESTING_GUIDE.md](../TESTING_GUIDE.md)** - Basic end-to-end testing from infrastructure to notification service

---

## 🔐 Security & OAuth2

### Keycloak Setup
3. **[KEYCLOAK_SETUP_GUIDE.md](./KEYCLOAK_SETUP_GUIDE.md)** - Step-by-step Keycloak configuration
   - Create realm, clients, roles, and users
   - Configure OAuth2 for the API Gateway

### OAuth2 Testing
4. **[OAUTH2_TESTING_GUIDE.md](./OAUTH2_TESTING_GUIDE.md)** - Complete OAuth2 security tests
   - Get JWT tokens
   - Test authentication and authorization
   - Role-based access control verification

---

## 🛡️ Resilience Patterns

### Circuit Breaker, Retry & Rate Limiting
5. **[RESILIENCE_TESTING_GUIDE.md](./RESILIENCE_TESTING_GUIDE.md)** - Test resilience patterns
   - Circuit Breaker testing (Kafka failures)
   - Retry mechanism testing (Database failures)
   - Rate limiting testing (High load)

---

## 🗺️ Project Planning

6. **[ROADMAP.md](../ROADMAP.md)** - Project roadmap and future enhancements
7. **[SYSTEM_STATUS.md](../SYSTEM_STATUS.md)** - Current system status and implemented features

---

## 📂 Document Structure

```
Distributed_Commerce_Platform/
├── docs/                           # 📚 All documentation
│   ├── README.md                  # This file
│   ├── KEYCLOAK_SETUP_GUIDE.md   # Keycloak configuration
│   ├── OAUTH2_TESTING_GUIDE.md   # OAuth2 testing
│   └── RESILIENCE_TESTING_GUIDE.md # Resilience patterns testing
├── TESTING_GUIDE.md               # Basic E2E testing
├── ROADMAP.md                     # Project roadmap
├── SYSTEM_STATUS.md               # System status
├── IMPORT_GUIDE.md                # IntelliJ import guide
└── README.md                      # Project README
```

---

## 🚀 Common Workflows

### First Time Setup
1. Follow [IMPORT_GUIDE.md](../IMPORT_GUIDE.md) to set up the project
2. Start infrastructure: `docker-compose up -d`
3. Configure Keycloak: [KEYCLOAK_SETUP_GUIDE.md](./KEYCLOAK_SETUP_GUIDE.md)
4. Run basic tests: [TESTING_GUIDE.md](../TESTING_GUIDE.md)

### Testing Security
1. Ensure Keycloak is configured
2. Get JWT tokens using [OAUTH2_TESTING_GUIDE.md](./OAUTH2_TESTING_GUIDE.md)
3. Run all 8 security test scenarios

### Testing Resilience
1. Follow [RESILIENCE_TESTING_GUIDE.md](./RESILIENCE_TESTING_GUIDE.md)
2. Test Circuit Breaker by stopping Kafka
3. Test Retry by stopping PostgreSQL
4. Test Rate Limiting with load tests

---

## 💡 Quick Commands

### Start All Services
```powershell
docker-compose up -d
```

### Stop All Services
```powershell
docker-compose down
```

### View Container Logs
```powershell
docker logs ecommerce-keycloak
docker logs ecommerce-kafka
```

### Get OAuth2 Token
```powershell
$body = @{
    grant_type = "password"
    client_id = "ecommerce-gateway"
    username = "john"
    password = "password123"
    scope = "openid"
}
$response = Invoke-RestMethod -Uri "http://localhost:8090/realms/ecommerce/protocol/openid-connect/token" -Method POST -Body $body
$token = $response.access_token
```

---

## 🎯 Architecture Overview

### Services
- **Eureka Server** (8761) - Service discovery
- **API Gateway** (8080) - OAuth2 Resource Server, rate limiting
- **Order Service** (8081) - Order management, circuit breaker
- **Inventory Service** (8082) - Stock management, retry pattern
- **Notification Service** (8083) - Event-driven notifications

### Infrastructure
- **Keycloak** (8090) - OAuth2 identity provider
- **Kafka** (9092) - Event streaming
- **PostgreSQL** (5432) - Database
- **Redis** (6379) - Caching & rate limiting
- **Zipkin** (9411) - Distributed tracing

---

**For questions or issues, refer to the individual guides above!** 🎉
