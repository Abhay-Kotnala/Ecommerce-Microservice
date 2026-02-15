$tokenObj = Get-Content token.json | ConvertFrom-Json
$token = $tokenObj.access_token
$headers = @{Authorization = "Bearer $token"}
$body = @{
    amount = 100
    currency = "usd"
    paymentMethodType = "card"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8085/api/payment/create-payment-intent" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Success!"
    $response | ConvertTo-Json
} catch {
    Write-Host "Error:"
    $_.Exception.Response
    $_.Exception.Message
}
