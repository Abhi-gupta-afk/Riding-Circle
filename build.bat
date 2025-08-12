@echo off
REM Build script for RideCircle Full Stack Application
REM This script builds the frontend and copies it to the backend static resources

echo Building RideCircle Full Stack Application...

REM Navigate to frontend directory
cd frontend

echo Installing frontend dependencies...
call npm install

echo Building frontend for production...
call npm run build

echo Frontend build completed! Files copied to backend/src/main/resources/static

REM Navigate back to original directory
cd ..

echo Building backend...
cd backend\ridecircle_prototype_one_working

REM Build the Spring Boot application
call mvn clean package -DskipTests

echo ✅ Build completed successfully!
echo You can now run the application with: java -jar target/ridecircle-backend-1.0.0.jar
echo Or use: mvn spring-boot:run
echo The application will be available at: http://localhost:8080
