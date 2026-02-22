@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo.
echo   ▶  YouTube Manager — Installer (Windows)
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

:: ── 2. Ask for YouTube API Key ───────────────
echo.
echo   You need a YouTube API Key from Google Cloud Console.
echo   Guide: https://console.cloud.google.com/apis/credentials
echo.
set /p API_KEY="  Enter your YouTube API Key: "

if "!API_KEY!"=="" (
    echo.
    echo   ✖  API Key cannot be empty.
    pause
    exit /b 1
)

echo   ✔  API Key received

:: ── 3. Use current folder ────────────────────
echo.
echo   All files will be created in the current folder:
echo   → %CD%
echo.

:: ── 4. Create .env ───────────────────────────
(
    echo YOUTUBE_API_KEY=!API_KEY!
) > .env

echo   ✔  .env created

:: ── 5. Create docker-compose.yml ─────────────
(
    echo services:
    echo   app:
    echo     image: mosqueiro/yt-manager:latest
    echo     ports:
    echo       - "3000:3000"
    echo     environment:
    echo       - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/youtube_manager
    echo       - YOUTUBE_API_KEY=${YOUTUBE_API_KEY}
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

:: ── 6. Pull images ───────────────────────────
echo.
echo   Downloading images (this may take a minute^)...
docker compose pull

echo   ✔  Images downloaded

:: ── 7. Start ─────────────────────────────────
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
