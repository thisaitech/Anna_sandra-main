# Run Sandra ERP Electron desktop app (no install required)
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$eb = Join-Path $root "electron-build"

Write-Host "Syncing web dist into electron-build (UI parity)..." -ForegroundColor Yellow
node (Join-Path $root "tools\sync-electron-dist.cjs")

$installer = Join-Path $eb "dist\downloads\Sandra_ERP_Setup.exe"
if (-not (Test-Path $installer)) {
  $release = Join-Path $eb "release\Sandra ERP Setup 1.0.0.exe"
  if (Test-Path $release) {
    node (Join-Path $root "tools\copy-desktop-installer.cjs")
  }
}

Push-Location $eb
try {
  if (-not (Test-Path "node_modules\electron")) {
    npm install
  }
  Write-Host "Starting Sandra ERP desktop at http://127.0.0.1:19847" -ForegroundColor Cyan
  npx electron .
} finally {
  Pop-Location
}
