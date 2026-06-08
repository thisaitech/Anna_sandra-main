# One-time: enable live website Windows installer download via Firebase Storage
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "Sandra ERP — installer hosting setup" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open Firebase Console and enable Storage (one-time):" -ForegroundColor Yellow
Write-Host "   https://console.firebase.google.com/project/petshop-9dee5/storage"
Write-Host ""
Write-Host "2. Build/copy installer locally:" -ForegroundColor Yellow
Write-Host "   .\build-desktop.ps1"
Write-Host "   (or: node tools\copy-desktop-installer.cjs if already built)"
Write-Host ""
Write-Host "3. Upload installer (needs Google credentials):" -ForegroundColor Yellow
Write-Host "   gcloud auth application-default login"
Write-Host "   node tools\upload-installer-storage.cjs"
Write-Host ""
Write-Host "4. Deploy storage rules + hosting:" -ForegroundColor Yellow
Write-Host "   firebase deploy --only storage,hosting"
Write-Host ""
Write-Host "5. Set Storage CORS (allows browser validation from web.app):" -ForegroundColor Yellow
Write-Host "   gsutil cors set firebase-storage-cors.json gs://petshop-9dee5.firebasestorage.app"
Write-Host ""

if (-not (Test-Path (Join-Path $root "dist\downloads\Sandra_ERP_Setup.exe"))) {
  node (Join-Path $root "tools\copy-desktop-installer.cjs")
}

Write-Host "Local installer ready at dist\downloads\Sandra_ERP_Setup.exe" -ForegroundColor Green
