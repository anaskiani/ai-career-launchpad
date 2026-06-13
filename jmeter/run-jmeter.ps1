# Run JMeter performance test for core modules
param(
    [int]$Threads = 10,
    [int]$RampUp = 20,
    [int]$Loops = 5,
    [string]$ApiHost = "localhost",
    [int]$Port = 5000
)

$jmeterRoot = $PSScriptRoot
$jmx = Join-Path $jmeterRoot "ai-career-launchpad-core-modules.jmx"
$resultsDir = Join-Path $jmeterRoot "results"
$reportsDir = Join-Path $jmeterRoot "reports"
$reportDir = Join-Path $jmeterRoot "reports\html-report"
$jtl = Join-Path $resultsDir "jmeter-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').jtl"

New-Item -ItemType Directory -Force -Path $resultsDir | Out-Null
New-Item -ItemType Directory -Force -Path $reportsDir | Out-Null
if (Test-Path $reportDir) {
    Remove-Item -Recurse -Force $reportDir
}

$localJmeter = Join-Path $jmeterRoot "tools\apache-jmeter-5.6.3\bin\jmeter.bat"
$jmeterCmd = Get-Command jmeter -ErrorAction SilentlyContinue
if ($jmeterCmd) {
    $jmeterExe = "jmeter"
} elseif (Test-Path $localJmeter) {
    $jmeterExe = $localJmeter
} else {
    Write-Host "JMeter not found. Download to jmeter/tools/ or install from apache.org/jmeter"
    exit 1
}

Write-Host "JMeter performance test - core modules"
Write-Host "Threads: $Threads | Ramp-up: ${RampUp}s | Loops: $Loops"
Write-Host "Target: http://${ApiHost}:${Port}/api"
Write-Host ""

& $jmeterExe -n `
    -t $jmx `
    -l $jtl `
    -e -o $reportDir `
    "-JHOST=$ApiHost" `
    "-JPORT=$Port" `
    "-JTHREADS=$Threads" `
    "-JRAMPUP=$RampUp" `
    "-JLOOPS=$Loops"

if ($LASTEXITCODE -eq 0 -and (Test-Path (Join-Path $reportDir "index.html"))) {
    Write-Host ""
    Write-Host "Done."
    Write-Host "Results: $jtl"
    Write-Host "HTML report: $reportDir\index.html"
} else {
    Write-Host ('JMeter failed or report was not generated. Exit code: ' + $LASTEXITCODE)
    if ($LASTEXITCODE -eq 0) {
        exit 1
    }
    exit $LASTEXITCODE
}
