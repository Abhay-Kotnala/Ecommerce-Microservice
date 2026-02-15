# Distributed Commerce Platform - Project Synopsis

## 📋 Project Overview

This is a **production-grade, event-driven microservices architecture** for an E-Commerce platform built using modern Spring Boot and Spring Cloud technologies. The system demonstrates enterprise-level distributed system design patterns, scalability, and resilience.

## 🎯 Core Objectives

- Implement a scalable microservices architecture with independent, loosely-coupled services
- Demonstrate asynchronous, event-driven communication between services
- Ensure high availability through resilience patterns (Circuit Breaker, Retry, Rate Limiting)
- Implement enterprise-grade security with OAuth2 authentication/authorization
- Enable distributed tracing and monitoring for production observability

## 🏗️ System Architecture

### Architectural Pattern
Database-per-Service with Event-Driven Communication

### Core Microservices

1. **Eureka Server** (Port 8761) - Service registry and discovery
2. **API Gateway** (Port 8080) - Single entry point with routing, rate limiting, and OAuth2 security
3. **Order Service** (Port 8081) - Order management with circuit breaker and retry patterns
4. **Inventory Service** (Port 8082) - Stock management with pessimistic locking
5. **Notification Service** (Port 8083) - Email notifications via event consumption

### Infrastructure Components

- **Apache Kafka** - Event streaming platform for asynchronous inter-service communication
- **PostgreSQL** - Separate databases for each service (orderdb, inventorydb, keycloakdb)
- **Redis** - Distributed caching and rate limiting
- **Zipkin** - Distributed tracing and monitoring
- **Keycloak** - OAuth2 identity and access management
- **Grafana + Loki** - Centralized logging and visualization
- **Docker Compose** - Infrastructure orchestration

## 💡 Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Language** | Java 17 |
| **Framework** | Spring Boot 3.2.2, Spring Cloud 2023.0.0 |
| **Service Discovery** | Netflix Eureka |
| **API Gateway** | Spring Cloud Gateway |
| **Messaging** | Apache Kafka |
| **Databases** | PostgreSQL |
| **Caching** | Redis |
| **Security** | OAuth2, Keycloak, JWT |
| **Resilience** | Resilience4j (Circuit Breaker, Retry, Rate Limiter) |
| **Monitoring** | Zipkin, Spring Boot Actuator, Grafana |
| **Logging** | Grafana Loki |
| **Containerization** | Docker, Docker Compose |
| **Frontend** | React + Vite |

## 🔄 Event-Driven Flow

```
Client → API Gateway → Order Service 
                          ↓ (publishes OrderPlacedEvent via Kafka)
                       Inventory Service (reserves stock)
                          ↓ (publishes StockReservedEvent/StockFailedEvent)
                       Order Service (confirms/cancels order)
                          ↓ (publishes OrderConfirmedEvent)
                       Notification Service (sends email)
```

## ✨ Key Features Implemented

### 1. Event-Driven Architecture
- Asynchronous communication via Kafka
- Fan-out pattern for event distribution
- Event sourcing for order lifecycle

### 2. Resilience Patterns
- Circuit Breaker (50% failure threshold, 10s recovery)
- Retry mechanism (3 attempts with exponential backoff)
- Rate Limiting (10 req/s for orders, 20 req/s for inventory)

### 3. Security
- OAuth2 Resource Server implementation
- JWT token-based authentication
- Role-Based Access Control (ROLE_USER, ROLE_ADMIN)
- Keycloak integration for identity management

### 4. Data Consistency
- Database-per-service pattern
- Pessimistic locking for inventory management
- Event-driven eventual consistency

### 5. Observability
- Distributed tracing with Zipkin
- Centralized logging with Loki
- Health monitoring via Spring Actuator
- Metrics visualization with Grafana

### 6. Full Dockerization
- Complete infrastructure in Docker containers
- One-command deployment (`docker-compose up`)
- Multi-service orchestration

## 🎓 Enterprise Patterns Demonstrated

- ✅ Microservices Architecture
- ✅ Service Discovery Pattern
- ✅ API Gateway Pattern
- ✅ Database per Service Pattern
- ✅ Event-Driven Architecture
- ✅ SAGA Pattern (Choreography-based)
- ✅ Circuit Breaker Pattern
- ✅ Retry Pattern
- ✅ Rate Limiting Pattern
- ✅ Distributed Tracing
- ✅ Centralized Configuration
- ✅ OAuth2 Security

## 📊 System Capabilities

### Business Functionality
- Product inventory management
- Order placement and lifecycle tracking
- Stock reservation and deduction
- Automated email notifications
- Real-time order status updates

### Technical Capabilities
- Handles service failures gracefully (circuit breaker)
- Automatic retry for transient failures
- Request rate limiting to prevent overload
- Distributed tracing across all services
- Centralized log aggregation
- Scalable horizontal scaling architecture

## 🚀 Deployment

### Single-Command Deployment
```bash
docker-compose up -d
```

This starts all infrastructure and application services with proper dependency management and health checks.

### Service Endpoints

| Service | URL | Description |
|---------|-----|-------------|
| Eureka Dashboard | http://localhost:8761 | Service registry |
| API Gateway | http://localhost:8080 | Application entry point |
| Zipkin Tracing | http://localhost:9411 | Distributed traces |
| Keycloak Admin | http://localhost:8090 | Identity management |
| Grafana Dashboard | http://localhost:3000 | Metrics & logs |
| Frontend UI | http://localhost:3001 | User interface |

## 📈 Project Significance

This project demonstrates:

- **Production-ready code** with enterprise design patterns
- **Cloud-native architecture** suitable for Kubernetes deployment
- **DevOps best practices** with containerization and orchestration
- **Security-first approach** with OAuth2/JWT implementation
- **Observability** through comprehensive monitoring and tracing
- **Resilience engineering** with multiple fault-tolerance mechanisms

## 🎯 Use Cases

This system is ideal for:

- Academic projects demonstrating advanced distributed systems concepts
- Portfolio projects showcasing full-stack microservices expertise
- Resume projects highlighting modern cloud-native development skills
- Understanding real-world e-commerce platform architecture

## 📝 Implementation Highlights

### Data Flow Example: Order Placement

1. **Client Request** → API Gateway validates JWT token and rate limits
2. **Order Service** → Creates order with PENDING status, publishes `OrderPlacedEvent`
3. **Inventory Service** → Consumes event, applies pessimistic lock, reserves stock
4. **Inventory Service** → Publishes `StockReservedEvent` or `StockFailedEvent`
5. **Order Service** → Updates order status to CONFIRMED or FAILED
6. **Notification Service** → Sends confirmation email to customer
7. **Distributed Tracing** → All steps tracked with correlation IDs in Zipkin

### Resilience in Action

- **Circuit Breaker**: If Kafka is down, circuit opens after 50% failures, prevents cascade
- **Retry Pattern**: Database connection failures retry 3 times with exponential backoff
- **Rate Limiting**: Protects services from overload during traffic spikes
- **Health Checks**: Actuator endpoints enable load balancer health monitoring

## 🔐 Security Implementation

### Authentication Flow

1. User authenticates with Keycloak
2. Keycloak issues JWT token with roles
3. Client includes JWT in Authorization header
4. API Gateway validates token signature and expiry
5. Extracts user roles and enforces access control
6. Routes request to appropriate microservice

### Authorization Rules

- **ROLE_USER**: Place orders, view inventory
- **ROLE_ADMIN**: All user permissions + manage inventory, view system metrics

## 📚 Documentation

Comprehensive documentation available in `/docs`:

- **KEYCLOAK_SETUP_GUIDE.md** - OAuth2 configuration
- **OAUTH2_TESTING_GUIDE.md** - Security testing procedures
- **RESILIENCE_TESTING_GUIDE.md** - Resilience pattern validation
- **DOCKER_WALKTHROUGH.md** - Containerization guide
- **TESTING_GUIDE.md** - End-to-end testing

## 🏆 Project Achievements

This is a **comprehensive, resume-worthy project** that showcases:

✅ Advanced knowledge of distributed systems architecture  
✅ Expertise in Spring Boot and Spring Cloud ecosystem  
✅ Understanding of event-driven design patterns  
✅ Proficiency in containerization and orchestration  
✅ Security best practices with OAuth2/JWT  
✅ Production-grade monitoring and observability  
✅ Resilience engineering and fault tolerance  
✅ Cloud-native development principles  

---

**This project represents a production-grade microservices system suitable for real-world e-commerce applications, demonstrating enterprise-level software engineering skills and modern cloud-native architecture patterns.**
