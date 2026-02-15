# Dockerization Walkthrough

We have successfully containerized the entire Distributed Commerce Platform. You can now run the complete stack with a single command.

## Changes Implemented
-   **Dockerfiles**: Created multi-stage Dockerfiles for:
    -   `eureka-server` (Discovery)
    -   `api-gateway` (Gateway)
    -   `order-service` (Order Management)
    -   `inventory-service` (Inventory Management)
    -   `notification-service` (Notifications)
-   **Infrastructure**: Updated `docker-compose.yml` to include these services and configure their inter-dependencies.

## How to Run

### Prerequisite
Ensure Docker Desktop is running.

### 1. Build and Start
Run the following command in the **project root directory** (`c:\Users\abhay\Downloads\ECommerce_Microservices_System`):
```powershell
docker-compose up -d --build
```
This will:
-   Build all Java applications using Maven (inside Docker).
-   Start infrastructure (Kafka, Postgres, Redis, Zipkin, Keycloak).
-   Start all microservices.

*Note: The first build might take a few minutes as it downloads Maven dependencies.*

### 2. Verify Deployment
Once expected containers are running (check with `docker ps`), you can verify:

-   **Eureka Dashboard**: [http://localhost:8761](http://localhost:8761) - Should show `API-GATEWAY`, `ORDER-SERVICE`, `INVENTORY-SERVICE`, `NOTIFICATION-SERVICE`.
-   **API Gateway**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
-   **Keycloak**: [http://localhost:8090](http://localhost:8090)
-   **Grafana (Logs)**: [http://localhost:3000](http://localhost:3000) (User: `admin`, Password: `admin`) -> Go to Explore -> Select `Loki`.
-   **Frontend**: [http://localhost:3001](http://localhost:3001) (Note: Uses port 3001, mapped to internal port 80).

## Troubleshooting

### Common Issues
1.  **API Gateway fails with "Unable to find GatewayFilterFactory with name RequestRateLimiter"**
    -   **Cause**: Missing Redis Reactive dependency.
    -   **Fix**: Ensure `spring-boot-starter-data-redis-reactive` is in `pom.xml`.

2.  **Keycloak fails with "database 'keycloakdb' does not exist"**
    -   **Cause**: The database wasn't created during initial Postgres startup.
    -   **Fix**: Run `docker exec -i ecommerce-postgres psql -U postgres -c "CREATE DATABASE keycloakdb;"`.

3.  **Services fail with "DuplicateKeyException"**
    -   **Cause**: Duplicate keys in `application.yml` (e.g., multiple `management:` sections).
    -   **Fix**: Merge configuration sections.

4.  **Docker Command Errors**
    -   Use **Service Names** (e.g., `keycloak`) in `docker-compose` commands, not Container Names (e.g., `ecommerce-keycloak`).
