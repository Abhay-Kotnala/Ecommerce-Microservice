@echo off
echo ===================================================
echo   E-Commerce Microservices - Permanent Fix Startup
echo ===================================================

echo 1. Stopping any running frontend instances...
taskkill /F /IM node.exe >nul 2>&1

echo 2. Stopping Docker containers...
docker-compose down

echo 3. Cleaning up potential port conflicts...
docker system prune -f >nul 2>&1

echo 4. Starting Backend Services (fresh build)...
docker-compose up -d --build

echo 5. Waiting for services to initialize (45 seconds)...
timeout /t 45 /nobreak

echo 6. Checking API Gateway Health...
curl -s http://localhost:8085/actuator/health | findstr "UP"
if %errorlevel% neq 0 (
    echo WARNING: API Gateway might not be ready yet.
) else (
    echo SUCCESS: API Gateway is UP.
)

echo 7. Starting Frontend...
cd frontend
echo Starting frontend in a new window...
start cmd /k "npm run dev"

echo ===================================================
echo   System Started! Access at: http://localhost:5173
echo ===================================================
pause
