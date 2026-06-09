# Build Sandra ERP Android APK and copy to dist/downloads
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "Sandra ERP - Android APK build" -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $root "android\local.properties"))) {
  Write-Host "Missing android\local.properties (Android SDK path)." -ForegroundColor Red
  Write-Host "Create: sdk.dir=C:\\Users\\YourUser\\AppData\\Local\\Android\\Sdk" -ForegroundColor Yellow
  exit 1
}

Push-Location (Join-Path $root "android")
try {
  Write-Host "Gradle assembleDebug..." -ForegroundColor Yellow
  .\gradlew.bat assembleDebug
} finally {
  Pop-Location
}

node (Join-Path $root "tools\copy-apk-installer.cjs")
Write-Host "APK ready: dist\downloads\android\Sandra_ERP.apk" -ForegroundColor Green
