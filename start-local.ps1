# Sandra ERP — local dev server (fresh start)
$ErrorActionPreference = "Stop"
$dist = Join-Path $PSScriptRoot "dist"

# Disable PWA service worker (it caches old broken bundles)
$sw = Join-Path $dist "sw.js"
$swOff = Join-Path $dist "sw.js.disabled"
if (Test-Path $sw) { Move-Item $sw $swOff -Force }
$swMap = Join-Path $dist "sw.js.map"
$swMapOff = Join-Path $dist "sw.js.map.disabled"
if (Test-Path $swMap) { Move-Item $swMap $swMapOff -Force }

# Free port 3002
Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Write-Host ""
Write-Host "Sandra ERP local server" -ForegroundColor Cyan
Write-Host "  App:       http://localhost:3002/"
Write-Host "  Login:     http://localhost:3002/login"
Write-Host "  Dev login: http://localhost:3002/dev-signin" -ForegroundColor Green
Write-Host ""
Write-Host "If the page is blank: Ctrl+Shift+R or clear site data for localhost:3002" -ForegroundColor Yellow
Write-Host ""

Start-Process "http://localhost:3002/?fresh=1"
npx --yes serve@14 $dist -s -l 3002
