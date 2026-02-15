@echo off
echo Starting Security Verification...

echo.
echo [1] Authenticating as 'john'...
curl -s -X POST "http://localhost:8090/realms/ecommerce/protocol/openid-connect/token" ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "grant_type=password" ^
  -d "client_id=ecommerce-gateway" ^
  -d "username=john" ^
  -d "password=password123" ^
  -d "scope=openid" > token.json

findstr "access_token" token.json > nul
if %errorlevel% equ 0 (
    echo [PASS] Token acquired!
) else (
    echo [FAIL] Failed to acquire token.
    type token.json
    exit /b 1
)

:: Extract token using PowerShell purely for JSON parsing (reliable one-liner)
for /f "usebackq tokens=*" %%i in (`powershell -Command "(Get-Content token.json | ConvertFrom-Json).access_token"`) do set TOKEN=%%i

echo.
echo [2] Testing Protected Endpoint (No Token)...
curl -s -o /dev/null -w "%%{http_code}" "http://localhost:8085/api/orders" > status_no_token.txt
set /p STATUS_NO_TOKEN=<status_no_token.txt
if "%STATUS_NO_TOKEN%"=="401" (
    echo [PASS] [%STATUS_NO_TOKEN%] Protected Endpoint Blocked
) else (
    echo [FAIL] [%STATUS_NO_TOKEN%] Protected Endpoint NOT Blocked (Expected 401)
)

echo.
echo [3] Testing Protected Endpoint (With Token)...
curl -s -o /dev/null -w "%%{http_code}" -H "Authorization: Bearer %TOKEN%" "http://localhost:8085/api/orders" > status_with_token.txt
set /p STATUS_WITH_TOKEN=<status_with_token.txt
if "%STATUS_WITH_TOKEN%"=="200" (
    echo [PASS] [%STATUS_WITH_TOKEN%] Protected Endpoint Accessed
) else (
    echo [FAIL] [%STATUS_WITH_TOKEN%] Protected Endpoint Access Failed (Expected 200)
    :: Debug output if failed
    curl -v -H "Authorization: Bearer %TOKEN%" "http://localhost:8085/api/orders"
)

echo.
echo [4] Testing Inventory Endpoint...
curl -s -o /dev/null -w "%%{http_code}" "http://localhost:8085/api/inventory" > status_inventory.txt
set /p STATUS_INVENTORY=<status_inventory.txt
if "%STATUS_INVENTORY%"=="200" (
    echo [PASS] [%STATUS_INVENTORY%] Inventory Accessible
) else (
    echo [FAIL] [%STATUS_INVENTORY%] Inventory Failed (Expected 200)
)

del token.json status_no_token.txt status_with_token.txt status_inventory.txt
echo.
echo Verification Complete!
