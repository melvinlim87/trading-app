# Trading App - Local Development Startup Script

Write-Host "🚀 Starting Trading App Locally..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is already running
$backendRunning = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*backend*"}
if ($backendRunning) {
    Write-Host "⚠️  Backend is already running!" -ForegroundColor Yellow
} else {
    Write-Host "📦 Starting Backend..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\melvi\Downloads\TradingApp\backend; Write-Host '🔧 Backend Server' -ForegroundColor Cyan; npm run start:dev"
    Start-Sleep -Seconds 3
}

Write-Host "📦 Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\melvi\Downloads\TradingApp\frontend; Write-Host '🎨 Frontend Server' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "✅ Starting servers..." -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Wait 10-15 seconds for servers to start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 Your app will be available at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   API Docs: http://localhost:3001/api/docs" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Enjoy your trading app!" -ForegroundColor Green
Write-Host ""
Write-Host "To stop: Close the terminal windows or press Ctrl+C in each" -ForegroundColor Yellow

# Wait a bit then open browser
Start-Sleep -Seconds 10
Start-Process "http://localhost:3000"
