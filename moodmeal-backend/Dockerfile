# ---- Étape 1 : build Maven ----
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ---- Étape 2 : exécution ----
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/moodmeal-backend-*.jar app.jar

# Charge les variables d'environnement si besoin
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
