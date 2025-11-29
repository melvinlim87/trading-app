# Trading App Deployment Script
# This script helps deploy your trading app to Vercel

Write-Host "🚀 Trading App Deployment Helper" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI found!" -ForegroundColor Green
}

Write-Host ""
Write-Host "What would you like to deploy?" -ForegroundColor Cyan
Write-Host "1. Frontend only"
Write-Host "2. Backend only"
Write-Host "3. Both (Frontend + Backend)"
Write-Host "4. Test production build locally"
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📦 Deploying Frontend to Vercel..." -ForegroundColor Cyan
        Set-Location -Path "frontend"
        vercel --prod
        Set-Location -Path ".."
        Write-Host "✅ Frontend deployed!" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "📦 Deploying Backend to Vercel..." -ForegroundColor Cyan
        Set-Location -Path "backend"
        vercel --prod
        Set-Location -Path ".."
        Write-Host "✅ Backend deployed!" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "📦 Deploying Backend first..." -ForegroundColor Cyan
        Set-Location -Path "backend"
        vercel --prod
        $backendUrl = Read-Host "Enter the backend URL from above"
        Set-Location -Path ".."
        
        Write-Host ""
        Write-Host "📦 Deploying Frontend..." -ForegroundColor Cyan
        Set-Location -Path "frontend"
        
        # Set environment variable
        Write-Host "Setting NEXT_PUBLIC_API_URL=$backendUrl" -ForegroundColor Yellow
        vercel env add NEXT_PUBLIC_API_URL production
        
        vercel --prod
        Set-Location -Path ".."
        Write-Host "✅ Both deployed!" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "🧪 Building production version locally..." -ForegroundColor Cyan
        
        Write-Host ""
        Write-Host "Building Frontend..." -ForegroundColor Yellow
        Set-Location -Path "frontend"
        npm run build
        
        Write-Host ""
        Write-Host "Building Backend..." -ForegroundColor Yellow
        Set-Location -Path "../backend"
        npm run build
        Set-Location -Path ".."
        
        Write-Host ""
        Write-Host "✅ Production build complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "To test locally:" -ForegroundColor Cyan
        Write-Host "  Frontend: cd frontend && npm start"
        Write-Host "  Backend:  cd backend && npm run start:prod"
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📚 For more deployment options, see DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
