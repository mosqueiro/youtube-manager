@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo.
echo   ▶  YouTube Manager — Setup (Windows)
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
set "HAS_DB=no"
set "HAS_IMAGES=no"

docker compose ps --status running 2>nul | findstr /C:"yt-manager" /C:"postgres" >nul 2>&1
if %errorlevel% equ 0 set "HAS_CONTAINERS=yes"

docker volume ls --format "{{.Name}}" 2>nul | findstr /C:"pgdata" >nul 2>&1
if %errorlevel% equ 0 set "HAS_DB=yes"

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

if "!HAS_DB!"=="yes" (
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
echo   1^) Update — download latest version (keeps your local data^)
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
echo   ⚙  Updating YouTube Manager...
echo.
echo   ⚙  Stopping containers...
docker compose down >nul 2>&1
echo   ✔  Containers stopped

echo   ⚙  Removing old app image...
docker rmi mosqueiro/yt-manager:latest >nul 2>&1
echo   ✔  Old image removed

echo.
echo   ⚙  Downloading latest version...
docker compose pull
echo   ✔  Latest images downloaded

echo.
echo   ⚙  Starting YouTube Manager...
docker compose up -d

echo.
echo   ✔  YouTube Manager updated successfully!
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
for /f "tokens=*" %%v in ('docker volume ls --format "{{.Name}}" ^| findstr "pgdata"') do (
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
echo      - App containers and database
echo      - Downloaded images and Docker images
echo      - Configuration files (.env, docker-compose.yml^)
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
docker rmi mosqueiro/yt-manager:latest >nul 2>&1
docker rmi postgres:16-alpine >nul 2>&1
echo   ✔  Images removed

echo   ⚙  Removing configuration files...
del /f /q docker-compose.yml >nul 2>&1
del /f /q .env >nul 2>&1
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

:: ── 3. Ask for Google OAuth credentials ─────
echo.
echo   You need Google OAuth credentials from Google Cloud Console.
echo   Follow the guide in the README to create them.
echo   https://github.com/mosqueiro/youtube-manager#-how-to-set-up-google-oauth-free
echo.
set /p CLIENT_ID="  Enter your Google OAuth Client ID: "
if "!CLIENT_ID!"=="" (
    echo   ✖  Client ID cannot be empty.
    pause
    exit /b 1
)

echo.
set /p CLIENT_SECRET="  Enter your Google OAuth Client Secret: "
if "!CLIENT_SECRET!"=="" (
    echo   ✖  Client Secret cannot be empty.
    pause
    exit /b 1
)

echo   ✔  Credentials received

:: ── 4. Use current folder ───────────────────
echo.
echo   All files will be created in the current folder:
echo   → %CD%
echo.

:: ── 5. Create .env ──────────────────────────
(
    echo GOOGLE_CLIENT_ID=!CLIENT_ID!
    echo GOOGLE_CLIENT_SECRET=!CLIENT_SECRET!
    echo GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
) > .env

echo   ✔  .env created

:: ── 6. Create docker-compose.yml ────────────
(
    echo services:
    echo   app:
    echo     image: mosqueiro/yt-manager:latest
    echo     ports:
    echo       - "3000:3000"
    echo     environment:
    echo       - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/youtube_manager
    echo       - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
    echo       - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    echo       - GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI}
    echo     volumes:
    echo       - images:/app/public/images
    echo     depends_on:
    echo       postgres:
    echo         condition: service_healthy
    echo     restart: unless-stopped
    echo.
    echo   postgres:
    echo     image: postgres:16-alpine
    echo     environment:
    echo       POSTGRES_DB: youtube_manager
    echo       POSTGRES_USER: postgres
    echo       POSTGRES_PASSWORD: postgres
    echo     volumes:
    echo       - pgdata:/var/lib/postgresql/data
    echo     healthcheck:
    echo       test: ["CMD-SHELL", "pg_isready -U postgres"]
    echo       interval: 5s
    echo       timeout: 3s
    echo       retries: 5
    echo     restart: unless-stopped
    echo.
    echo volumes:
    echo   pgdata:
    echo   images:
) > docker-compose.yml

echo   ✔  docker-compose.yml created

:: ── 7. Pull images ──────────────────────────
echo.
echo   Downloading images (this may take a minute^)...
docker compose pull

echo   ✔  Images downloaded

:: ── 8. Start ────────────────────────────────
echo.
echo   Starting YouTube Manager...
docker compose up -d

echo.
echo   ✔  YouTube Manager is running!
echo.
echo   ╔═══════════════════════════════════════════╗
echo   ║                                           ║
echo   ║   Open in your browser:                   ║
echo   ║   → http://localhost:3000                 ║
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
