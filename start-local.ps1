# Sandra ERP — local dev server (PWA install works on localhost)
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$dist = Join-Path $root "dist"

# Ensure service worker exists for PWA install testing
$sw = Join-Path $dist "sw.js"
if (-not (Test-Path $sw)) {
  if (Test-Path (Join-Path $dist "sw.js.disabled")) {
    Copy-Item (Join-Path $dist "sw.js.disabled") $sw -Force
    Write-Host "Restored sw.js from sw.js.disabled" -ForegroundColor Yellow
  } else {
    Write-Host "Generating sw.js..." -ForegroundColor Yellow
    node (Join-Path $root "tools\generate-sw.cjs")
  }
}

# Free port 3002
Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Write-Host ""
Write-Host "Sandra ERP local server" -ForegroundColor Cyan
Write-Host "  App:       http://localhost:3002/"
Write-Host "  Login:     http://localhost:3002/login"
Write-Host "  Dev login: http://localhost:3002/dev-signin" -ForegroundColor Green
Write-Host "  PWA:       Install App button works; use address-bar icon if prompt not ready" -ForegroundColor Green
Write-Host ""
Write-Host "Hard refresh: http://localhost:3002/login?fresh=1" -ForegroundColor Yellow
Write-Host ""

Start-Process "http://localhost:3002/login?pwa-reset=1&fresh=1"
npx --yes serve@14 $dist -s -l 3002
