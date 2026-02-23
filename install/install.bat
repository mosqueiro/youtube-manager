@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

set "VERSION=0.0.5"
set "IMAGE=mosqueiro/yt-manager:%VERSION%"

echo.
echo   ▶  YouTube Manager v%VERSION% — Setup (Windows)
echo   ─────────────────────────────────
echo.

:: ── 1. Check Docker ──────────────────────────
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo   ✖  Docker not found.
    echo.
    echo   Install Docker Desktop:
    echo   https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo   ✖  Docker is installed but not running.
    echo      Please start Docker Desktop and run this script again.
    echo.
    pause
    exit /b 1
)

echo   ✔  Docker found

:: ── 2. Detect existing installation ─────────
if not exist "docker-compose.yml" goto :fresh_install

findstr /C:"yt-manager" docker-compose.yml >nul 2>&1
if %errorlevel% neq 0 goto :fresh_install

:: ── Existing installation found ─────────────
set "HAS_CONTAINERS=no"
set "HAS_DATA=no"
set "HAS_IMAGES=no"

docker compose ps --status running 2>nul | findstr /C:"yt-manager" >nul 2>&1
if %errorlevel% equ 0 set "HAS_CONTAINERS=yes"

docker volume ls --format "{{.Name}}" 2>nul | findstr /C:"data" >nul 2>&1
if %errorlevel% equ 0 set "HAS_DATA=yes"

docker volume ls --format "{{.Name}}" 2>nul | findstr /C:"images" >nul 2>&1
if %errorlevel% equ 0 set "HAS_IMAGES=yes"

echo.
echo   ╔═══════════════════════════════════════════╗
echo   ║   Existing installation detected!         ║
echo   ╚═══════════════════════════════════════════╝
echo.
echo   Location: %CD%

if "!HAS_CONTAINERS!"=="yes" (
    echo   Containers: running
) else (
    echo   Containers: stopped
)

if "!HAS_DATA!"=="yes" (
    echo   Database: found (has data^)
) else (
    echo   Database: not found
)

if "!HAS_IMAGES!"=="yes" (
    echo   Images cache: found
) else (
    echo   Images cache: not found
)

echo.
echo   ℹ  None of these options affect your YouTube account.
echo      Everything is local to this computer only.
echo.
echo   What would you like to do?
echo.
echo   1^) Update to v%VERSION% (keeps your local data^)
echo   2^) Reset local database — clears saved channels/videos from this app
echo   3^) Uninstall — remove the app from this computer
echo   4^) Cancel
echo.
set /p CHOICE="  Choose [1-4]: "

if "!CHOICE!"=="1" goto :update
if "!CHOICE!"=="2" goto :reset_db
if "!CHOICE!"=="3" goto :uninstall
goto :cancel

:: ── UPDATE ───────────────────────────────────
:update
echo.
echo   ⚙  Updating YouTube Manager to v%VERSION%...
echo.
echo   ⚙  Stopping containers...
docker compose down >nul 2>&1
echo   ✔  Containers stopped

echo   ⚙  Removing old app image...
for /f "tokens=*" %%i in ('docker images --format "{{.Repository}}:{{.Tag}}" ^| findstr "mosqueiro/yt-manager"') do (
    docker rmi "%%i" >nul 2>&1
)
echo   ✔  Old image removed

:: Update docker-compose.yml to new version
powershell -Command "(Get-Content docker-compose.yml) -replace 'mosqueiro/yt-manager:[^ ]*', '%IMAGE%' | Set-Content docker-compose.yml"

echo.
echo   ⚙  Downloading v%VERSION%...
docker compose pull
echo   ✔  v%VERSION% downloaded

echo.
echo   ⚙  Starting YouTube Manager...
docker compose up -d

echo.
echo   ✔  YouTube Manager updated to v%VERSION%!
echo.
echo   ℹ  Your database and images were preserved.
echo.
echo   ╔═══════════════════════════════════════════╗
echo   ║                                           ║
echo   ║   Open in your browser:                   ║
echo   ║   → http://localhost:3000                 ║
echo   ║                                           ║
echo   ╚═══════════════════════════════════════════╝
echo.
start http://localhost:3000
pause
exit /b 0

:: ── RESET DATABASE ───────────────────────────
:reset_db
echo.
echo   This will clear the local database of this app (saved channels,
echo   videos, and sync history stored on your computer^).
echo.
echo   ℹ  Your YouTube account is NOT affected. Nothing is deleted from YouTube.
echo      You will just need to add your channels again in the app.
echo.
set /p CONFIRM="  Continue? (y/N): "
if /i not "!CONFIRM!"=="y" goto :cancel

echo.
echo   ⚙  Stopping containers...
docker compose down >nul 2>&1
echo   ✔  Containers stopped

echo   ⚙  Removing database volume...
for /f "tokens=*" %%v in ('docker volume ls --format "{{.Name}}" ^| findstr "data"') do (
    docker volume rm "%%v" >nul 2>&1
)
echo   ✔  Database removed

echo.
echo   ⚙  Starting YouTube Manager with fresh database...
docker compose up -d

echo.
echo   ✔  Database reset complete!
echo      YouTube Manager is running with a fresh database.
echo.
echo   ╔═══════════════════════════════════════════╗
echo   ║                                           ║
echo   ║   Open in your browser:                   ║
echo   ║   → http://localhost:3000                 ║
echo   ║                                           ║
echo   ╚═══════════════════════════════════════════╝
echo.
start http://localhost:3000
pause
exit /b 0

:: ── UNINSTALL ────────────────────────────────
:uninstall
echo.
echo   This will remove YouTube Manager from this computer:
echo      - App containers, database, and cached images
echo      - Docker images
echo      - Configuration files (docker-compose.yml^)
echo.
echo   ℹ  Your YouTube account is NOT affected. Nothing is deleted from YouTube.
echo      You can reinstall anytime by running this script again.
echo.
set /p CONFIRM="  Continue? (y/N): "
if /i not "!CONFIRM!"=="y" goto :cancel

echo.
echo   ⚙  Stopping containers and removing volumes...
docker compose down -v >nul 2>&1
echo   ✔  Containers and volumes removed

echo   ⚙  Removing Docker images...
for /f "tokens=*" %%i in ('docker images --format "{{.Repository}}:{{.Tag}}" ^| findstr "mosqueiro/yt-manager"') do (
    docker rmi "%%i" >nul 2>&1
)
echo   ✔  Images removed

echo   ⚙  Removing configuration files...
del /f /q docker-compose.yml >nul 2>&1
echo   ✔  Files removed

echo.
echo   ✔  YouTube Manager has been completely uninstalled.
echo.
pause
exit /b 0

:: ── CANCEL ───────────────────────────────────
:cancel
echo   Cancelled.
pause
exit /b 0

:: ══════════════════════════════════════════════
::  FRESH INSTALL (no existing installation)
:: ══════════════════════════════════════════════
:fresh_install

:: ── 3. Use current folder ───────────────────
echo.
echo   All files will be created in the current folder:
echo   → %CD%
echo.

:: ── 4. Create docker-compose.yml ────────────
(
    echo services:
    echo   app:
    echo     image: %IMAGE%
    echo     ports:
    echo       - "3000:3000"
    echo     volumes:
    echo       - data:/app/data
    echo       - images:/app/public/images
    echo     restart: unless-stopped
    echo.
    echo volumes:
    echo   data:
    echo   images:
) > docker-compose.yml

echo   ✔  docker-compose.yml created

:: ── 5. Pull images ──────────────────────────
echo.
echo   Downloading v%VERSION% (this may take a minute^)...
docker compose pull

echo   ✔  v%VERSION% downloaded

:: ── 6. Start ────────────────────────────────
echo.
echo   Starting YouTube Manager...
docker compose up -d

echo.
echo   ✔  YouTube Manager v%VERSION% is running!
echo.
echo   ╔═══════════════════════════════════════════╗
echo   ║                                           ║
echo   ║   Open in your browser:                   ║
echo   ║   → http://localhost:3000                 ║
echo   ║                                           ║
echo   ║   On first access, you'll be asked to     ║
echo   ║   enter your Google OAuth credentials.    ║
echo   ║                                           ║
echo   ╚═══════════════════════════════════════════╝
echo.
echo   Useful commands (run from this folder^):
echo     docker compose logs -f     # view logs
echo     docker compose down        # stop
echo     docker compose up -d       # start again
echo.

:: Auto-open browser
start http://localhost:3000

pause
