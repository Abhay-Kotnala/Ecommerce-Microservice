# Build Stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# 1. Copy POMs
COPY pom.xml .
COPY api-gateway/pom.xml api-gateway/
COPY common-models/pom.xml common-models/
COPY order-service/pom.xml order-service/
COPY inventory-service/pom.xml inventory-service/
COPY notification-service/pom.xml notification-service/
COPY payment-service/pom.xml payment-service/
COPY eureka-server/pom.xml eureka-server/

# 2. Dependencies
RUN mvn dependency:go-offline -B

# 3. Source
COPY notification-service/src notification-service/src
COPY common-models/src common-models/src

# 4. Build
# RUN mvn clean install -DskipTests -pl common-models -am
RUN mvn clean package -DskipTests -pl notification-service -am

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/notification-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
