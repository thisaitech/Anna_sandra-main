#!/usr/bin/env pwsh

# Quick deployment script for Receipt Scanner fix
# Usage: .\deploy-receipt-fix.ps1

Write-Host "`n=== AI Receipt Scanner Deployment ===" -ForegroundColor Cyan
Write-Host "This will deploy the fixed aiReceiptScan Cloud Function" -ForegroundColor Gray

# Step 1: Build
Write-Host "`n[1/3] Building Cloud Functions..." -ForegroundColor Yellow
Push-Location functions
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "✅ Build successful" -ForegroundColor Green

# Step 2: Deploy
Write-Host "`n[2/3] Deploying to Firebase..." -ForegroundColor Yellow
Write-Host "Note: When prompted about deleting old functions, answer 'n' (no)" -ForegroundColor Gray

# Run deployment
firebase deploy --only functions:aiReceiptScan

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Deployment may have failed" -ForegroundColor Yellow
    Write-Host "Try answering 'n' when asked about deletion" -ForegroundColor Gray
    exit 1
}

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green

# Step 3: Verify
Write-Host "`n[3/3] Verifying deployment..." -ForegroundColor Yellow
Write-Host "`nTo check if deployment was successful:" -ForegroundColor Cyan
Write-Host "  firebase functions:log --only aiReceiptScan" -ForegroundColor Gray

Write-Host "`n=== Testing the Receipt Scanner ===" -ForegroundColor Cyan
Write-Host "1. Go to http://localhost:3000/purchases (or your running app)" -ForegroundColor Gray
Write-Host "2. Click the 'AI Scan' button" -ForegroundColor Gray
Write-Host "3. Upload an invoice image" -ForegroundColor Gray
Write-Host "4. It should now extract the data successfully!" -ForegroundColor Gray

Write-Host "`n"
