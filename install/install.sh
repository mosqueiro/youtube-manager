#!/bin/bash
set -e

# ─────────────────────────────────────────────
#  YouTube Manager — Installer (macOS / Linux)
# ─────────────────────────────────────────────

echo ""
echo "  ▶  YouTube Manager — Setup"
echo "  ─────────────────────────────────"
echo ""

# ── 1. Install Docker if needed ──────────────
if ! command -v docker &>/dev/null; then
  echo "  ⚙  Docker not found. Installing..."
  echo ""

  if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v brew &>/dev/null; then
      echo "  ⚙  Homebrew not found. Installing Homebrew first..."
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
      if [ -f /opt/homebrew/bin/brew ]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
      fi
    fi
    echo "  ⚙  Installing Docker Desktop via Homebrew..."
    brew install --cask docker
    echo ""
    echo "  ✔  Docker Desktop installed!"
    echo "     Opening Docker Desktop — wait for it to start..."
    open -a Docker
    echo -n "  ⏳ Waiting for Docker to start"
    for i in $(seq 1 60); do
      if docker info &>/dev/null 2>&1; then break; fi
      echo -n "."
      sleep 2
    done
    echo ""
    if ! docker info &>/dev/null 2>&1; then
      echo "  ✖  Docker is taking too long to start."
      echo "     Open Docker Desktop manually, wait until it's running, then run this script again."
      exit 1
    fi

  else
    echo "  ⚙  Installing Docker via get.docker.com..."
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER"
    echo ""
    echo "  ✔  Docker installed!"
    echo "  ⚙  Starting Docker service..."
    sudo systemctl enable docker
    sudo systemctl start docker
    if ! docker info &>/dev/null 2>&1; then
      echo ""
      echo "  ⚠  Docker was installed, but you need to log out and back in"
      echo "     for group permissions to take effect."
      echo "     Or run: newgrp docker"
      echo "     Then run this script again."
      exit 1
    fi
  fi
fi

# ── 2. Check Docker is running ───────────────
if ! docker info &>/dev/null 2>&1; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "  ⚙  Docker is not running. Opening Docker Desktop..."
    open -a Docker
    echo -n "  ⏳ Waiting for Docker to start"
    for i in $(seq 1 60); do
      if docker info &>/dev/null 2>&1; then break; fi
      echo -n "."
      sleep 2
    done
    echo ""
  fi
  if ! docker info &>/dev/null 2>&1; then
    echo "  ✖  Docker is not running. Please start Docker and try again."
    exit 1
  fi
fi

echo "  ✔  Docker is ready"

# ── 3. Detect existing installation ──────────
INSTALL_DIR=""
EXISTING=false

if [ -f "docker-compose.yml" ] && grep -q "yt-manager" "docker-compose.yml" 2>/dev/null; then
  INSTALL_DIR="$(pwd)"
  EXISTING=true
elif [ -f "$HOME/youtube-manager/docker-compose.yml" ] && grep -q "yt-manager" "$HOME/youtube-manager/docker-compose.yml" 2>/dev/null; then
  INSTALL_DIR="$HOME/youtube-manager"
  EXISTING=true
fi

if [ "$EXISTING" = true ]; then
  cd "$INSTALL_DIR"

  # Gather info about existing installation
  HAS_CONTAINERS=false
  HAS_DB_VOLUME=false
  HAS_IMG_VOLUME=false
  PROJECT_NAME=$(basename "$INSTALL_DIR" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]//g')

  if docker compose ps --status running 2>/dev/null | grep -q "yt-manager\|postgres"; then
    HAS_CONTAINERS=true
  fi

  # Check for volumes (project-name prefixed)
  if docker volume ls --format '{{.Name}}' 2>/dev/null | grep -q "pgdata"; then
    HAS_DB_VOLUME=true
  fi
  if docker volume ls --format '{{.Name}}' 2>/dev/null | grep -q "images"; then
    HAS_IMG_VOLUME=true
  fi

  echo ""
  echo "  ╔═══════════════════════════════════════════╗"
  echo "  ║   Existing installation detected!         ║"
  echo "  ╚═══════════════════════════════════════════╝"
  echo ""
  echo "  Location: $INSTALL_DIR"

  if [ "$HAS_CONTAINERS" = true ]; then
    echo "  Containers: running"
  else
    echo "  Containers: stopped"
  fi

  if [ "$HAS_DB_VOLUME" = true ]; then
    echo "  Database: found (has data)"
  else
    echo "  Database: not found"
  fi

  if [ "$HAS_IMG_VOLUME" = true ]; then
    echo "  Images cache: found"
  else
    echo "  Images cache: not found"
  fi

  echo ""
  echo "  ℹ  None of these options affect your YouTube account."
  echo "     Everything is local to this computer only."
  echo ""
  echo "  What would you like to do?"
  echo ""
  echo "  1) Update — download latest version (keeps your local data)"
  echo "  2) Reset local database — clears saved channels/videos from this app"
  echo "  3) Uninstall — remove the app from this computer"
  echo "  4) Cancel"
  echo ""
  read -rp "  Choose [1-4]: " CHOICE

  case "$CHOICE" in
    1)
      # ── UPDATE ──────────────────────────────
      echo ""
      echo "  ⚙  Updating YouTube Manager..."
      echo ""
      echo "  ⚙  Stopping containers..."
      docker compose down 2>/dev/null || true
      echo "  ✔  Containers stopped"

      echo "  ⚙  Removing old app image..."
      docker rmi mosqueiro/yt-manager:latest 2>/dev/null || true
      echo "  ✔  Old image removed"

      echo ""
      echo "  ⚙  Downloading latest version..."
      docker compose pull
      echo "  ✔  Latest images downloaded"

      echo ""
      echo "  ⚙  Starting YouTube Manager..."
      docker compose up -d

      echo ""
      echo "  ✔  YouTube Manager updated successfully!"
      echo ""
      echo "  ℹ  Your database and images were preserved."
      echo ""
      echo "  ╔═══════════════════════════════════════════╗"
      echo "  ║                                           ║"
      echo "  ║   Open in your browser:                   ║"
      echo "  ║   → http://localhost:3000                 ║"
      echo "  ║                                           ║"
      echo "  ╚═══════════════════════════════════════════╝"
      echo ""

      if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:3000" 2>/dev/null &
      elif command -v xdg-open &>/dev/null; then
        xdg-open "http://localhost:3000" 2>/dev/null &
      fi
      exit 0
      ;;

    2)
      # ── RESET DATABASE ──────────────────────
      echo ""
      echo "  This will clear the local database of this app (saved channels,"
      echo "  videos, and sync history stored on your computer)."
      echo ""
      echo "  ℹ  Your YouTube account is NOT affected. Nothing is deleted from YouTube."
      echo "     You will just need to add your channels again in the app."
      echo ""
      read -rp "  Continue? (y/N): " CONFIRM
      if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo "  Cancelled."
        exit 0
      fi

      echo ""
      echo "  ⚙  Stopping containers..."
      docker compose down 2>/dev/null || true
      echo "  ✔  Containers stopped"

      echo "  ⚙  Removing database volume..."
      docker volume rm "$(docker volume ls --format '{{.Name}}' | grep pgdata)" 2>/dev/null || true
      echo "  ✔  Database removed"

      echo ""
      echo "  ⚙  Starting YouTube Manager with fresh database..."
      docker compose up -d

      echo ""
      echo "  ✔  Database reset complete!"
      echo "     YouTube Manager is running with a fresh database."
      echo ""
      echo "  ╔═══════════════════════════════════════════╗"
      echo "  ║                                           ║"
      echo "  ║   Open in your browser:                   ║"
      echo "  ║   → http://localhost:3000                 ║"
      echo "  ║                                           ║"
      echo "  ╚═══════════════════════════════════════════╝"
      echo ""

      if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:3000" 2>/dev/null &
      elif command -v xdg-open &>/dev/null; then
        xdg-open "http://localhost:3000" 2>/dev/null &
      fi
      exit 0
      ;;

    3)
      # ── UNINSTALL ───────────────────────────
      echo ""
      echo "  This will remove YouTube Manager from this computer:"
      echo "     - App containers and database"
      echo "     - Downloaded images and Docker images"
      echo "     - Configuration files (.env, docker-compose.yml)"
      echo ""
      echo "  ℹ  Your YouTube account is NOT affected. Nothing is deleted from YouTube."
      echo "     You can reinstall anytime by running this script again."
      echo ""
      read -rp "  Continue? (y/N): " CONFIRM
      if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo "  Cancelled."
        exit 0
      fi

      echo ""
      echo "  ⚙  Stopping containers and removing volumes..."
      docker compose down -v 2>/dev/null || true
      echo "  ✔  Containers and volumes removed"

      echo "  ⚙  Removing Docker images..."
      docker rmi mosqueiro/yt-manager:latest 2>/dev/null || true
      docker rmi postgres:16-alpine 2>/dev/null || true
      echo "  ✔  Images removed"

      echo "  ⚙  Removing configuration files..."
      rm -f "$INSTALL_DIR/docker-compose.yml"
      rm -f "$INSTALL_DIR/.env"
      echo "  ✔  Files removed"

      echo ""
      echo "  ✔  YouTube Manager has been completely uninstalled."
      echo ""
      exit 0
      ;;

    4|*)
      echo "  Cancelled."
      exit 0
      ;;
  esac
fi

# ══════════════════════════════════════════════
#  FRESH INSTALL (no existing installation)
# ══════════════════════════════════════════════

# ── 4. Ask for Google OAuth credentials ──────
echo ""
echo "  You need Google OAuth credentials from Google Cloud Console."
echo "  Follow the guide in the README to create them."
echo "  https://github.com/mosqueiro/youtube-manager#-how-to-set-up-google-oauth-free"
echo ""
read -rp "  Enter your Google OAuth Client ID: " CLIENT_ID
if [ -z "$CLIENT_ID" ]; then
  echo "  ✖  Client ID cannot be empty."
  exit 1
fi

echo ""
read -rp "  Enter your Google OAuth Client Secret: " CLIENT_SECRET
if [ -z "$CLIENT_SECRET" ]; then
  echo "  ✖  Client Secret cannot be empty."
  exit 1
fi

echo "  ✔  Credentials received"

# ── 5. Choose install directory ──────────────
DEFAULT_DIR="$HOME/youtube-manager"
echo ""
read -rp "  Install directory [$DEFAULT_DIR]: " INSTALL_DIR
INSTALL_DIR="${INSTALL_DIR:-$DEFAULT_DIR}"

mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

echo "  ✔  Directory: $INSTALL_DIR"

# ── 6. Create .env ───────────────────────────
cat > .env <<EOF
GOOGLE_CLIENT_ID=$CLIENT_ID
GOOGLE_CLIENT_SECRET=$CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
EOF

echo "  ✔  .env created"

# ── 7. Create docker-compose.yml ─────────────
cat > docker-compose.yml <<'EOF'
services:
  app:
    image: mosqueiro/yt-manager:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/youtube_manager
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI}
    volumes:
      - images:/app/public/images
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
  images:
EOF

echo "  ✔  docker-compose.yml created"

# ── 8. Pull images ───────────────────────────
echo ""
echo "  Downloading images (this may take a minute)..."
docker compose pull

echo "  ✔  Images downloaded"

# ── 9. Start ─────────────────────────────────
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
