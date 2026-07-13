# 1. Use official Java image
FROM eclipse-temurin:17-jdk-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy jar file
COPY target/*.jar app.jar

# 4. Expose port
EXPOSE 8080

# 5. Run the app
ENTRYPOINT ["java","-jar","app.jar"]