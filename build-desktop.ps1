# Build Sandra ERP Windows desktop installer and copy into dist/downloads
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$eb = Join-Path $root "electron-build"

Write-Host "Sandra ERP - desktop build" -ForegroundColor Cyan

# Sync web dist into electron-build/dist (skip downloads - installer copied after build)
Write-Host "Syncing dist -> electron-build/dist..." -ForegroundColor Yellow
$srcDist = Join-Path $root "dist"
$dstDist = Join-Path $eb "dist"
if (-not (Test-Path $dstDist)) { New-Item -ItemType Directory -Path $dstDist | Out-Null }
Get-ChildItem $srcDist -Exclude "downloads" | ForEach-Object {
  if ($_.PSIsContainer) {
    robocopy $_.FullName (Join-Path $dstDist $_.Name) /MIR /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
  } else {
    Copy-Item $_.FullName (Join-Path $dstDist $_.Name) -Force
  }
}

Push-Location $eb
try {
  if (-not (Test-Path "node_modules")) {
    Write-Host "Installing electron-build dependencies..." -ForegroundColor Yellow
    npm install
  }
  Write-Host "Running electron-builder (NSIS)..." -ForegroundColor Yellow
  npx electron-builder --win nsis
} finally {
  Pop-Location
}

Write-Host "Validating and copying installer..." -ForegroundColor Yellow
node (Join-Path $root "tools\copy-desktop-installer.cjs")
node (Join-Path $root "tools\patch-desktop-ui.cjs")
node (Join-Path $root "tools\sync-electron-dist.cjs")

Write-Host ""
Write-Host "Desktop build complete." -ForegroundColor Green
Write-Host "  Installer: electron-build\release\Sandra ERP Setup 1.0.0.exe"
Write-Host "  Download copy: dist\downloads\Sandra_ERP_Setup.exe"
Write-Host ""
Write-Host "Upload to Firebase Storage (for live website download):" -ForegroundColor Yellow
Write-Host "  node tools\upload-installer-storage.cjs"
Write-Host "  firebase deploy --only storage,hosting"
