# Saves backend + frontend unit test output to screenshots/report for Word document.
$reportDir = Join-Path $PSScriptRoot "screenshots\report"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$outFile = Join-Path $reportDir "08-terminal-test-results.txt"

$lines = @()
$lines += "AI Career Launchpad — Automated Test Results"
$lines += "Captured: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$lines += ("=" * 60)
$lines += ""

$backendRoot = Join-Path $PSScriptRoot "..\backend"
$frontendRoot = Join-Path $PSScriptRoot "..\frontend"

$lines += ">>> BACKEND UNIT TESTS (npm run test:unit)"
$lines += ""
Push-Location $backendRoot
$lines += (npm run test:unit 2>&1 | Out-String)
Pop-Location

$lines += ""
$lines += ">>> BACKEND SMOKE TESTS (npm run test:smoke)"
$lines += ""
Push-Location $backendRoot
$lines += (npm run test:smoke 2>&1 | Out-String)
Pop-Location

$lines += ""
$lines += ">>> FRONTEND COMPONENT TESTS (npm test)"
$lines += ""
Push-Location $frontendRoot
$lines += (npm test 2>&1 | Out-String)
Pop-Location

$lines += ""
$lines += ">>> SELENIUM GUI TESTS (npm run test:gui:report)"
$lines += "See PNG screenshots 01–07 in this folder."
$lines += ""

$lines | Set-Content -Path $outFile -Encoding UTF8
Write-Host "Saved: $outFile"
Write-Host "Tip: Open the file, select all, copy, paste into Word — or screenshot the terminal after running tests."
