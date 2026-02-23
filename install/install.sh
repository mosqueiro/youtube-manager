#!/bin/bash
set -e

VERSION="0.0.6"
IMAGE="mosqueiro/yt-manager:${VERSION}"

# ─────────────────────────────────────────────
#  YouTube Manager — Installer (macOS / Linux)
# ─────────────────────────────────────────────

echo ""
echo "  ▶  YouTube Manager v${VERSION} — Setup"
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
  HAS_DATA_VOLUME=false
  HAS_IMG_VOLUME=false

  if docker compose ps --status running 2>/dev/null | grep -q "yt-manager"; then
    HAS_CONTAINERS=true
  fi

  # Check for volumes
  if docker volume ls --format '{{.Name}}' 2>/dev/null | grep -q "data"; then
    HAS_DATA_VOLUME=true
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

  if [ "$HAS_DATA_VOLUME" = true ]; then
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
  echo "  1) Update to v${VERSION} (keeps your local data)"
  echo "  2) Reset local database — clears saved channels/videos from this app"
  echo "  3) Uninstall — remove the app from this computer"
  echo "  4) Cancel"
  echo ""
  read -rp "  Choose [1-4]: " CHOICE

  case "$CHOICE" in
    1)
      # ── UPDATE ──────────────────────────────
      echo ""
      echo "  ⚙  Updating YouTube Manager to v${VERSION}..."
      echo ""
      echo "  ⚙  Stopping containers..."
      docker compose down 2>/dev/null || true
      echo "  ✔  Containers stopped"

      echo "  ⚙  Removing old app image..."
      docker images --format '{{.Repository}}:{{.Tag}}' | grep "mosqueiro/yt-manager" | xargs -r docker rmi 2>/dev/null || true
      echo "  ✔  Old image removed"

      # Update docker-compose.yml to new version
      sed -i.bak "s|mosqueiro/yt-manager:[^ ]*|${IMAGE}|g" docker-compose.yml && rm -f docker-compose.yml.bak

      echo ""
      echo "  ⚙  Downloading v${VERSION}..."
      docker compose pull
      echo "  ✔  v${VERSION} downloaded"

      echo ""
      echo "  ⚙  Starting YouTube Manager..."
      docker compose up -d

      echo ""
      echo "  ✔  YouTube Manager updated to v${VERSION}!"
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
      docker volume rm "$(docker volume ls --format '{{.Name}}' | grep data)" 2>/dev/null || true
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
      echo "     - App containers, database, and cached images"
      echo "     - Docker images"
      echo "     - Configuration files (docker-compose.yml)"
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
      docker images --format '{{.Repository}}:{{.Tag}}' | grep "mosqueiro/yt-manager" | xargs -r docker rmi 2>/dev/null || true
      echo "  ✔  Images removed"

      echo "  ⚙  Removing configuration files..."
      rm -f "$INSTALL_DIR/docker-compose.yml"
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

# ── 4. Choose install directory ──────────────
DEFAULT_DIR="$HOME/youtube-manager"
echo ""
read -rp "  Install directory [$DEFAULT_DIR]: " INSTALL_DIR
INSTALL_DIR="${INSTALL_DIR:-$DEFAULT_DIR}"

mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

echo "  ✔  Directory: $INSTALL_DIR"

# ── 5. Create docker-compose.yml ─────────────
cat > docker-compose.yml <<EOF
services:
  app:
    image: ${IMAGE}
    ports:
      - "3000:3000"
    volumes:
      - data:/app/data
      - images:/app/public/images
    restart: unless-stopped

volumes:
  data:
  images:
EOF

echo "  ✔  docker-compose.yml created"

# ── 6. Pull images ───────────────────────────
echo ""
echo "  Downloading v${VERSION} (this may take a minute)..."
docker compose pull

echo "  ✔  v${VERSION} downloaded"

# ── 7. Start ─────────────────────────────────
echo ""
echo "  Starting YouTube Manager..."
docker compose up -d

echo ""
echo "  ✔  YouTube Manager v${VERSION} is running!"
echo ""
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║                                           ║"
echo "  ║   Open in your browser:                   ║"
echo "  ║   → http://localhost:3000                 ║"
echo "  ║                                           ║"
echo "  ║   On first access, you'll be asked to     ║"
echo "  ║   enter your Google OAuth credentials.    ║"
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
