#!/bin/bash
set -e

# ─────────────────────────────────────────────
#  YouTube Manager — Installer (macOS / Linux)
# ─────────────────────────────────────────────

echo ""
echo "  ▶  YouTube Manager — Installer"
echo "  ─────────────────────────────────"
echo ""

# ── 1. Check Docker ──────────────────────────
if ! command -v docker &>/dev/null; then
  echo "  ✖  Docker not found."
  echo ""
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "  Install Docker Desktop:"
    echo "  https://www.docker.com/products/docker-desktop/"
  else
    echo "  Install Docker:"
    echo "    curl -fsSL https://get.docker.com | sh"
    echo "    sudo usermod -aG docker \$USER"
    echo "  Then log out and back in, and run this script again."
  fi
  echo ""
  exit 1
fi

if ! docker info &>/dev/null; then
  echo "  ✖  Docker is installed but not running."
  echo "     Please start Docker and run this script again."
  echo ""
  exit 1
fi

echo "  ✔  Docker found"

# ── 2. Ask for YouTube API Key ───────────────
echo ""
echo "  You need a YouTube API Key from Google Cloud Console."
echo "  Guide: https://console.cloud.google.com/apis/credentials"
echo ""
read -rp "  Enter your YouTube API Key: " API_KEY

if [ -z "$API_KEY" ]; then
  echo ""
  echo "  ✖  API Key cannot be empty."
  exit 1
fi

echo "  ✔  API Key received"

# ── 3. Choose install directory ──────────────
DEFAULT_DIR="$HOME/youtube-manager"
echo ""
read -rp "  Install directory [$DEFAULT_DIR]: " INSTALL_DIR
INSTALL_DIR="${INSTALL_DIR:-$DEFAULT_DIR}"

mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

echo "  ✔  Directory: $INSTALL_DIR"

# ── 4. Create .env ───────────────────────────
cat > .env <<EOF
YOUTUBE_API_KEY=$API_KEY
EOF

echo "  ✔  .env created"

# ── 5. Create docker-compose.yml ─────────────
cat > docker-compose.yml <<'EOF'
services:
  app:
    image: mosqueiro/yt-manager:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/youtube_manager
      - YOUTUBE_API_KEY=${YOUTUBE_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: youtube_manager
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

volumes:
  pgdata:
EOF

echo "  ✔  docker-compose.yml created"

# ── 6. Pull images ───────────────────────────
echo ""
echo "  Downloading images (this may take a minute)..."
docker compose pull

echo "  ✔  Images downloaded"

# ── 7. Start ─────────────────────────────────
echo ""
echo "  Starting YouTube Manager..."
docker compose up -d

echo ""
echo "  ✔  YouTube Manager is running!"
echo ""
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║                                           ║"
echo "  ║   Open in your browser:                   ║"
echo "  ║   → http://localhost:3000                 ║"
echo "  ║                                           ║"
echo "  ╚═══════════════════════════════════════════╝"
echo ""
echo "  Useful commands:"
echo "    cd $INSTALL_DIR"
echo "    docker compose logs -f     # view logs"
echo "    docker compose down        # stop"
echo "    docker compose up -d       # start again"
echo ""

# Auto-open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "http://localhost:3000" 2>/dev/null &
elif command -v xdg-open &>/dev/null; then
  xdg-open "http://localhost:3000" 2>/dev/null &
fi
