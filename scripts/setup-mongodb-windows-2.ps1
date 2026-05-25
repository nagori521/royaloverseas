param(
  [string]$MongoVersion = "7.0.14",
  [string]$MongoMsiUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14-signed.msi",
  [string]$MongoServiceName = "MongoDB",
  [int]$MongoPort = 27017
)

$ErrorActionPreference = "Stop"

Write-Host "=== Royal Overseas MongoDB setup ===" -ForegroundColor Cyan
Write-Host "MongoVersion: $MongoVersion"

function Test-Command($name) {
  try {
    $null = & $name --version 2>$null
    return $true
  } catch {
    return $false
  }
}

function Get-MongoBinDir($version) {
  return "C:\Program Files\MongoDB\Server\$version\bin"
}

function Start-FirstExistingService($candidates) {
  foreach ($cand in $candidates) {
    try {
      $svc = Get-Service -Name $cand -ErrorAction Stop
      if ($svc.Status -ne 'Running') {
        Write-Host "Starting service: $($svc.Name)" -ForegroundColor Yellow
        Start-Service -Name $cand
      }
      return $true
    } catch {
      # ignore and try next
    }
  }
  return $false
}

Write-Host "\nSTEP 1 — CHECK mongod"
$hasMongod = Test-Command "mongod"
$MongoBinDir = Get-MongoBinDir $MongoVersion
Write-Host "mongod found: $hasMongod"
Write-Host "Expected Mongo bin dir: $MongoBinDir"

if (-not $hasMongod) {
  Write-Host "\nSTEP 2 — DOWNLOAD + INSTALL MongoDB MSI" -ForegroundColor Yellow

  $downloadDir = Join-Path $env:TEMP "mongodb-setup"
  New-Item -ItemType Directory -Force -Path $downloadDir | Out-Null

  $msiPath = Join-Path $downloadDir "mongodb.msi"
  Write-Host "Downloading MongoDB MSI..."
  Write-Host "URL: $MongoMsiUrl"
  Invoke-WebRequest -Uri $MongoMsiUrl -OutFile $msiPath

  Write-Host "Installing MongoDB (best-effort complete install)..."

  $argsSilent = @(
    "/i", $msiPath,
    "/qn",
    "ADDLOCAL=all",
    "INSTALLLOCATION=C:\Program Files\MongoDB\Server\$MongoVersion",
    "SERVICE=1"
  )

  try {
    Start-Process -FilePath "msiexec.exe" -ArgumentList $argsSilent -Wait -NoNewWindow
  } catch {
    Write-Host "Silent install failed; retrying with UI mode..." -ForegroundColor Yellow

    $argsUi = @(
      "/i", $msiPath,
      "/qb",
      "ADDLOCAL=all",
      "INSTALLLOCATION=C:\Program Files\MongoDB\Server\$MongoVersion",
      "SERVICE=1"
    )

    Start-Process -FilePath "msiexec.exe" -ArgumentList $argsUi -Wait -NoNewWindow
  }
}

Write-Host "\nSTEP 3 — ADD MongoDB bin to PATH (User)"
if (Test-Path $MongoBinDir) {
  $currentUserPath = [Environment]::GetEnvironmentVariable('Path', 'User')
  if ($null -eq $currentUserPath) { $currentUserPath = '' }

  $contains = $false
  if ($currentUserPath -like ("*" + $MongoBinDir + "*")) { $contains = $true }

  if (-not $contains) {
    $newPath = $currentUserPath.TrimEnd(';')
    if ($newPath.Length -gt 0) { $newPath = $newPath + ';' }
    $newPath = $newPath + $MongoBinDir

    [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
    Write-Host "Updated User PATH with: $MongoBinDir" -ForegroundColor Green
  } else {
    Write-Host "PATH already contains: $MongoBinDir" -ForegroundColor Green
  }

  $env:Path = $env:Path + ';' + $MongoBinDir
} else {
  Write-Host "Expected bin dir not found: $MongoBinDir" -ForegroundColor Yellow
  Write-Host "Add MongoDB bin to PATH manually if needed." -ForegroundColor Yellow
}

Write-Host "\nSTEP 3b — VERIFY mongod --version"
try {
  $v = & mongod --version
  Write-Host $v
} catch {
  Write-Host "mongod is still not recognized. Restart your terminal and try again." -ForegroundColor Yellow
}

Write-Host "\nSTEP 4 — START MongoDB SERVICE"
$serviceCandidates = @($MongoServiceName, 'MongoDB Server', 'mongodb')
$started = Start-FirstExistingService $serviceCandidates
if (-not $started) {
  Write-Host "MongoDB service not found by common names. Check Services.msc manually." -ForegroundColor Yellow
}

Write-Host "\nSTEP 5 — VERIFY SERVICE"
try {
  Get-Service *mongo* | Format-Table Name, Status, StartType
} catch {
  Write-Host "Unable to list *mongo* services." -ForegroundColor Yellow
}

Write-Host "\nSTEP 5b — VERIFY PORT $MongoPort (127.0.0.1)"
try {
  $ok = Test-NetConnection -ComputerName 127.0.0.1 -Port $MongoPort -WarningAction SilentlyContinue
  Write-Host ("Port reachable: " + $ok.TcpTestSucceeded)
} catch {
  Write-Host "Port check failed (non-fatal)." -ForegroundColor Yellow
}

Write-Host "\nSTEP 6 — NEXT: TEST BACKEND" -ForegroundColor Cyan
Write-Host "Run in project root:"
Write-Host "  npm run dev:server"
Write-Host "Then open:"
Write-Host "  http://localhost:5173"

Write-Host "\nMongoDB setup script completed." -ForegroundColor Cyan

