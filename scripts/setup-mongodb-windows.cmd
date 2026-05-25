@echo off
setlocal enabledelayedexpansion

set "MongoVersion=7.0.14"
set "MongoMsiUrl=https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14-signed.msi"
set "MongoServiceName=MongoDB"
set "MongoPort=27017"

echo === Royal Overseas MongoDB setup (Windows .cmd) ===

where mongod >nul 2>&1
if %errorlevel%==0 (
  echo mongod already exists.
  goto :verify
)

echo mongod not found. Downloading and installing MongoDB...

set "downloadDir=%TEMP%\mongodb-setup"
if not exist "%downloadDir%" mkdir "%downloadDir%"
set "msiPath=%downloadDir%\mongodb.msi"

REM Try certutil first (fast)
certutil -urlcache -split -f "%MongoMsiUrl%" "%msiPath%" >nul 2>&1
if not exist "%msiPath%" (
  echo certutil download failed. Trying PowerShell fallback...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%MongoMsiUrl%' -OutFile '%msiPath%'"
)

if not exist "%msiPath%" (
  echo ERROR: MongoDB MSI download failed.
  exit /b 1
)

echo Installing MSI...

set "installLocation=C:\Program Files\MongoDB\Server\%MongoVersion%"

REM Silent install; best-effort flags.
msiexec.exe /i "%msiPath%" /qn ADDLOCAL=all INSTALLLOCATION="%installLocation%" SERVICE=1

echo Adding MongoDB bin to User PATH...
set "mongoBin=%installLocation%\bin"

REM setx truncates to 1024 chars; that’s why we only append.
for /f "usebackq tokens=*" %%A in (`powershell -NoProfile -Command "( [Environment]::GetEnvironmentVariable('Path','User') )"`) do set "userPath=%%A"

echo %userPath% | find /i "%mongoBin%" >nul
if %errorlevel%==0 (
  echo PATH already contains MongoDB bin.
) else (
  if "!userPath!"=="" (
    set "newPath=%mongoBin%"
  ) else (
    set "newPath=!userPath!;%mongoBin%"
  )
  setx Path "!newPath!" >nul
  echo PATH updated.
)

echo Starting MongoDB service...
sc query "%MongoServiceName%" >nul 2>&1
if %errorlevel%==0 (
  sc start "%MongoServiceName%" >nul 2>&1
) else (
  REM attempt common alternatives
  sc start "MongoDB Server" >nul 2>&1
  sc start "mongodb" >nul 2>&1
)

:verify
echo Verifying service/port...

echo Services (matching mongo):
powershell -NoProfile -Command "Get-Service *mongo* | Select-Object Name,Status,StartType | Format-Table -AutoSize" 

echo Checking port %MongoPort% on 127.0.0.1...
powershell -NoProfile -Command "(Test-NetConnection -ComputerName 127.0.0.1 -Port %MongoPort% -WarningAction SilentlyContinue).TcpTestSucceeded" 

echo Next: Run backend
echo   cd server
echo   npm run dev:server
echo Done.
endlocal

