# Build Stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# 1. Copy POMs (Cached Layer)
COPY pom.xml .
COPY api-gateway/pom.xml api-gateway/
# Copy other modules just in case parent pom refs them, 
# but effectively we only need api-gateway deps.
# However, to be safe and simple, we copy all poms to ensure reactor works if needed.
COPY common-models/pom.xml common-models/
COPY order-service/pom.xml order-service/
COPY inventory-service/pom.xml inventory-service/
COPY notification-service/pom.xml notification-service/
COPY payment-service/pom.xml payment-service/
COPY eureka-server/pom.xml eureka-server/

# 2. Download Dependencies (Cached Layer)
# -B: Batch mode
# dependency:go-offline: Download all deps
RUN mvn dependency:go-offline -B

# 3. Copy Source Code (Changes frequently)
COPY api-gateway/src api-gateway/src
# We don't need other sources for api-gateway

# 4. Build
# -DskipTests: Skip tests for speed
# -pl api-gateway: Build only this project
# -am: Also make dependencies (if any)
RUN mvn clean package -DskipTests -pl api-gateway -am

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
