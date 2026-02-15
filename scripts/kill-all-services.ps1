# Kill All Java Processes (Microservices)
# This script stops all running Java processes to clear port conflicts

Write-Host "Stopping all Java processes..." -ForegroundColor Yellow

# Get all Java processes
$javaProcesses = Get-Process -Name java -ErrorAction SilentlyContinue

if ($javaProcesses) {
    foreach ($process in $javaProcesses) {
        Write-Host "Stopping Java process: PID $($process.Id)" -ForegroundColor Cyan
        Stop-Process -Id $process.Id -Force
    }
    Write-Host "`nAll Java processes stopped successfully!" -ForegroundColor Green
} else {
    Write-Host "No Java processes found running." -ForegroundColor Green
}

Write-Host "`nPorts cleared. You can now start your microservices in this order:" -ForegroundColor Yellow
Write-Host "1. Eureka Server (port 8761)" -ForegroundColor White
Write-Host "2. API Gateway (port 8080)" -ForegroundColor White
Write-Host "3. Inventory Service (port 8082)" -ForegroundColor White
Write-Host "4. Order Service (port 8081)" -ForegroundColor White
Write-Host "5. Notification Service (port 8083)" -ForegroundColor White
