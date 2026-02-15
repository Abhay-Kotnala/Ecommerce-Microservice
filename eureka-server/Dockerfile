# Build Stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# 1. Copy POMs (Cached Layer)
COPY pom.xml .
COPY api-gateway/pom.xml api-gateway/
COPY common-models/pom.xml common-models/
COPY order-service/pom.xml order-service/
COPY inventory-service/pom.xml inventory-service/
COPY notification-service/pom.xml notification-service/
COPY payment-service/pom.xml payment-service/
COPY eureka-server/pom.xml eureka-server/

# 2. Download Dependencies (Cached Layer)
RUN mvn dependency:go-offline -B

# 3. Copy Source Code
COPY eureka-server/src eureka-server/src

# 4. Build
RUN mvn clean package -DskipTests -pl eureka-server -am

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/eureka-server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
