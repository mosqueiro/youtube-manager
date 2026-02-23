---
name: youtube-manager-setup
description: Install, run, update, and manage YouTube Manager via Docker. Use when a user wants to set up YouTube Manager on their computer, check for updates, or troubleshoot the installation.
version: 0.0.5
---

# YouTube Manager — AI Setup Guide

You are helping a user install and manage **YouTube Manager** on their computer using Docker.
The app runs entirely locally — nothing is sent to external servers except YouTube API calls during sync.

## Current Version

**0.0.5**

The Docker image is `mosqueiro/yt-manager:0.0.5` on Docker Hub.

---

## Prerequisites

Before anything, check if the user has:

1. **Docker Desktop** installed and running
   - macOS/Linux: `docker info` should work
   - Windows: Docker Desktop must be open
   - If not installed, guide them to https://www.docker.com/products/docker-desktop/

2. **Google OAuth credentials** (Client ID + Client Secret)
   - Free from Google Cloud Console
   - Guide: https://github.com/mosqueiro/youtube-manager#-how-to-set-up-google-oauth-free
   - Required scopes: `youtube.readonly`
   - Redirect URI must be: `http://localhost:3000/api/auth/callback`
   - Credentials are entered in the app's Setup screen on first access (no `.env` needed)

---

## Fresh Installation

Follow these steps in order:

### 1. Create a folder

```bash
mkdir -p ~/youtube-manager && cd ~/youtube-manager
```

On Windows:
```cmd
mkdir C:\yt-manager && cd C:\yt-manager
```

### 2. Create the `docker-compose.yml`

```yaml
services:
  app:
    image: mosqueiro/yt-manager:0.0.5
    ports:
      - "3000:3000"
    volumes:
      - data:/app/data
      - images:/app/public/images
    restart: unless-stopped

volumes:
  data:
  images:
```

### 3. Download and start

```bash
docker compose pull
docker compose up -d
```

### 4. Open the app

Tell the user to open **http://localhost:3000** in their browser.
On first access, they'll be redirected to the Setup screen to enter their Google OAuth credentials.

---

## Check for Updates

ALWAYS check if the user is running the latest version before troubleshooting issues.

### How to check the running version

The version is shown at the bottom of the sidebar in the app (e.g. `v0.0.5`).

### How to update

Update the image tag in `docker-compose.yml` to the new version, then:

```bash
cd ~/youtube-manager          # or wherever they installed it
docker compose down
docker compose pull
docker compose up -d
```

This preserves the database and all saved data. Only the app image is updated.

---

## Common Operations

### Stop the app
```bash
docker compose down
```

### Start the app again
```bash
docker compose up -d
```

### View logs (for debugging)
```bash
docker compose logs -f
```

### Reset the database (clear all channels/videos)

This only clears local data. Nothing on YouTube is affected.

```bash
docker compose down
docker volume rm $(docker volume ls --format '{{.Name}}' | grep data)
docker compose up -d
```

### Uninstall completely

```bash
docker compose down -v
docker images --format '{{.Repository}}:{{.Tag}}' | grep mosqueiro/yt-manager | xargs docker rmi
rm -f docker-compose.yml
```

---

## How to Use the App (after installing)

Guide the user through these steps:

1. **Setup**: On first access, enter Google OAuth Client ID and Client Secret
2. **Add channels**: Go to Settings > paste a YouTube URL, handle (@MrBeast), or channel ID > click Add
3. **Connect Google**: Click "Connect with Google" on each channel card to see scheduled/private videos
4. **Sync**: Click the red Sync button to fetch latest videos from YouTube
5. **Browse**: Use the Calendar view to see all videos organized by date and channel
6. **Set goals**: In Settings, use +/- buttons to set daily upload goals per channel

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "Port 3000 already in use" | Stop whatever is using port 3000, or edit `docker-compose.yml` to change `"3000:3000"` to `"3001:3000"` and access via `http://localhost:3001` |
| App won't start | Run `docker compose logs app` and check for errors |
| "Docker is not running" | Open Docker Desktop and wait for it to fully start, then try again |
| OAuth token expired | In Testing mode, tokens expire after 7 days. Click "Reconnect" on the channel card in Settings |
| Blank page / loading forever | Run `docker compose down && docker compose up -d` to restart |

---

## Persistent Data (Docker volumes)

The app has two persistent folders — both must be mapped as Docker volumes:

| Volume | Container path | Contents |
|---|---|---|
| `data` | `/app/data` | SQLite database (`youtube-manager.db`) — channels, videos, sync history, Google credentials |
| `images` | `/app/public/images` | Downloaded channel avatars and video thumbnails |

- `docker compose down` preserves volumes (data safe)
- `docker compose down -v` **deletes** volumes (data lost)
- Updating the app image does NOT affect volumes

---

## Important Notes for the AI

- The app is **read-only** — it cannot post, delete, or modify anything on YouTube
- All data is stored locally in SQLite (inside Docker volume `data`)
- Images (avatars, thumbnails) are in Docker volume `images`
- Google OAuth credentials are stored in the SQLite database (no `.env` file needed)
- There is NO `.env` file — credentials are entered via the Setup screen in the browser
- YouTube API quota is only used during Sync, NOT while browsing
- The free Google tier gives 10,000 units/day (each sync uses ~3-5 units per channel)
- In Google OAuth Testing mode, tokens expire after 7 days — users need to reconnect
- The redirect URI MUST be exactly `http://localhost:3000/api/auth/callback`
