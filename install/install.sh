#!/bin/bash
set -e

# ─────────────────────────────────────────────
#  YouTube Manager — Installer (macOS / Linux)
# ─────────────────────────────────────────────

echo ""
echo "  ▶  YouTube Manager — Installer"
echo "  ─────────────────────────────────"
echo ""

# ── 1. Install Docker if needed ──────────────
if ! command -v docker &>/dev/null; then
  echo "  ⚙  Docker not found. Installing..."
  echo ""

  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS — install via Homebrew
    if ! command -v brew &>/dev/null; then
      echo "  ⚙  Homebrew not found. Installing Homebrew first..."
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
      # Add brew to PATH for Apple Silicon
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
    # Wait for Docker to be ready
    echo -n "  ⏳ Waiting for Docker to start"
    for i in $(seq 1 60); do
      if docker info &>/dev/null 2>&1; then
        break
      fi
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
    # Linux (Ubuntu/Debian) — install via official script
    echo "  ⚙  Installing Docker via get.docker.com..."
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER"
    echo ""
    echo "  ✔  Docker installed!"
    echo "  ⚙  Starting Docker service..."
    sudo systemctl enable docker
    sudo systemctl start docker
    # Allow current session to use docker without re-login
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

# Check Docker is running
if ! docker info &>/dev/null 2>&1; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "  ⚙  Docker is not running. Opening Docker Desktop..."
    open -a Docker
    echo -n "  ⏳ Waiting for Docker to start"
    for i in $(seq 1 60); do
      if docker info &>/dev/null 2>&1; then
        break
      fi
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

# ── 2. Ask for Google OAuth credentials ──────
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
GOOGLE_CLIENT_ID=$CLIENT_ID
GOOGLE_CLIENT_SECRET=$CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
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
