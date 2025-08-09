# AI Medical Assistant Backend Deployment Script
# This script helps deploy the backend to AWS

Write-Host "🚀 AI Medical Assistant Backend Deployment" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with your configuration:" -ForegroundColor Yellow
    Write-Host "1. Copy env.example to .env" -ForegroundColor Yellow
    Write-Host "2. Add your OpenAI API key" -ForegroundColor Yellow
    Write-Host "3. Configure AWS settings" -ForegroundColor Yellow
    exit 1
}

# Check if AWS CLI is configured
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS CLI is configured" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not configured!" -ForegroundColor Red
    Write-Host "Please run 'aws configure' first" -ForegroundColor Yellow
    exit 1
}

# Get deployment stage
$stage = Read-Host "Enter deployment stage (dev/staging/prod) [default: dev]"
if (-not $stage) { $stage = "dev" }

Write-Host "Deploying to stage: $stage" -ForegroundColor Cyan

# Build TypeScript
Write-Host "📦 Building TypeScript..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to AWS
Write-Host "🚀 Deploying to AWS..." -ForegroundColor Yellow
try {
    if ($stage -eq "prod") {
        npm run deploy:prod
    } else {
        serverless deploy --stage $stage
    }
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Backend is now deployed!" -ForegroundColor Green
Write-Host "Check the output above for your API endpoints" -ForegroundColor Cyan 