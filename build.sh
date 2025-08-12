#!/bin/bash

# Build script for RideCircle Full Stack Application
# This script builds the frontend and copies it to the backend static resources

echo "Building RideCircle Full Stack Application..."

# Navigate to frontend directory
cd frontend

echo "Installing frontend dependencies..."
npm install

echo "Building frontend for production..."
npm run build

echo "Frontend build completed! Files copied to backend/src/main/resources/static"

# Navigate back to original directory
cd ..

echo "Building backend..."
cd backend/ridecircle_prototype_one_working

# Build the Spring Boot application
mvn clean package -DskipTests

echo "✅ Build completed successfully!"
echo "You can now run the application with: java -jar target/ridecircle-backend-1.0.0.jar"
echo "Or use: mvn spring-boot:run"
echo "The application will be available at: http://localhost:8080"
