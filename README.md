# 📺 YouTube Manager

> A visual calendar to track your favorite YouTube channels. See every video published, set daily upload goals, and never miss a post.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

🌐 [Português (BR)](README.pt-BR.md)

---

## ✨ What Can You Do With It?

### 📅 See All Your Channels in One Calendar
Browse a **weekly calendar** that shows every video published by the channels you follow. Each channel gets its own row with a unique color, so you can instantly tell which channel posted what and when.

### 🎯 Set Daily Upload Goals
For each channel, set how many videos per day you expect. The calendar will show **amber "Needs video" slots** for days that are missing uploads, and **"Missed" slots** for past days that didn't hit the goal. Perfect for content creators tracking their own channels or keeping an eye on competitors.

### 📊 View Full Video Stats
Click on any video to see the full details — **views, likes, comments, duration, description**, and a direct link to watch on YouTube. All stats are fetched and stored locally so you can check them anytime.

### 🔄 Sync Whenever You Want
Hit the **Sync** button to fetch the latest data from YouTube. The app saves everything locally, so you only use your YouTube API quota when you sync — browsing the calendar afterwards costs nothing.

### 🌍 Your Timezone, Your Schedule
Set your timezone in Settings and all video publish times will be displayed accordingly. Supports every timezone from UTC-12 to UTC+12.

### 🌙 Dark & Light Mode
Toggle between dark and light themes. The dark mode uses YouTube's official dark colors for a native feel.

### 📱 Works on Desktop & Mobile
Full sidebar navigation on desktop, hamburger menu on mobile. The calendar adapts to your screen size.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have installed:

- [**Node.js**](https://nodejs.org/) (v18 or later)
- [**Docker Desktop**](https://www.docker.com/products/docker-desktop/) (for the database)
- A **YouTube API Key** (free — see below how to get one)

---

### 🔑 How to Get a YouTube API Key (Free)

You need a YouTube API Key so the app can fetch channel and video data. It's free and takes about 2 minutes:

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**
2. Sign in with your Google account
3. Click **"Select a project"** at the top → then **"New Project"**
4. Name it anything (e.g. "YouTube Manager") and click **Create**
5. Wait a few seconds, then make sure your new project is selected at the top
6. In the left sidebar, go to **"APIs & Services"** → **"Library"**
7. Search for **"YouTube Data API v3"** and click on it
8. Click the blue **"Enable"** button
9. Now go to **"APIs & Services"** → **"Credentials"** (in the left sidebar)
10. Click **"+ Create Credentials"** → **"API Key"**
11. Copy the key that appears — that's your `YOUTUBE_API_KEY`! 🎉

> 💡 The free tier gives you **10,000 units/day**, which is more than enough. Each sync uses roughly 3-5 units per channel.

---

### 📦 Quick Install (Recommended)

Just run **one command** — it will ask for your API key, download everything, and start the app automatically.

#### 🍎 macOS / 🐧 Linux

```bash
curl -fsSL https://raw.githubusercontent.com/mosqueiro/youtube-manager/main/install/install.sh | bash
```

#### 🪟 Windows

**Option A** — Download and double-click:

1. Create a folder on your PC (e.g. `C:\yt-manager`)
2. Download **[install.zip](https://github.com/mosqueiro/youtube-manager/raw/main/install/install.zip)** and extract `install.bat` into that folder
3. Double-click `install.bat` — it will configure everything inside that folder

**Option B** — PowerShell:

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/mosqueiro/youtube-manager/main/install/install.bat" -OutFile install.bat; .\install.bat
```

> The installer will: ask for your API key → create the project folder → download the Docker images → start PostgreSQL + the app → open **http://localhost:3000** in your browser. Done! 🎉

---

### 📦 Manual Installation (For Developers)

If you prefer to run from source:

**1. Clone the repository**

```bash
git clone https://github.com/mosqueiro/youtube-manager.git
cd youtube-manager
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up your environment**

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your YouTube API Key:

```env
YOUTUBE_API_KEY=paste_your_key_here
DATABASE_URL=postgresql://postgres:postgres@localhost:5435/youtube_manager
```

**4. Start the database**

```bash
docker compose up -d
```

**5. Start the app**

```bash
npm run dev
```

**6. Open your browser** at **http://localhost:3000** 🎉

> The database tables are created automatically — no extra setup needed!

---

## 📖 How to Use

### ➕ Adding Channels

1. Go to **Settings** (in the sidebar)
2. In the "Add Channel" section, paste any of these:
   - A channel URL (e.g. `https://youtube.com/@MrBeast`)
   - A handle (e.g. `@MrBeast`)
   - A channel ID (e.g. `UCX6OQ3DkcsbYNE6H8uQQuVA`)
3. Click **Add** — the app will automatically fetch the channel's name, avatar, and info

### 🔄 Syncing Videos

1. Click the red **Sync** button in the top-right corner
2. Wait for it to finish (you'll see a spinner, then "Done!" ✅)
3. The calendar will automatically update with the latest videos

> You only need to sync when you want fresh data. The rest of the time, everything is served from your local database — fast and free.

### 📅 Browsing the Calendar

- Use the **← →** arrows next to the date to navigate between weeks
- Switch between **Week** and **Month** view with the toggle buttons
- Each channel is a separate row — look at the colored border on the left to identify them
- Click any **video card** to see full details (stats, description, YouTube link)

### 🎯 Setting Upload Goals

1. Go to **Settings** and scroll to your channels
2. Use the **+/-** buttons next to each channel to set the daily video goal
3. Go back to the **Calendar** — you'll now see amber "Needs video" slots for days below the goal

### 🌍 Changing Your Timezone

1. Go to **Settings**
2. Select your timezone from the dropdown
3. All video times across the app will update instantly

---

## ☁️ Deploy on EasyPanel

If you have a server with [EasyPanel](https://easypanel.io), you can deploy YouTube Manager in a few clicks.

### 1. Create a new project

- Open your EasyPanel dashboard
- Click **+ New Project** and name it `youtube-manager`

### 2. Add PostgreSQL

- Inside the project, click **+ New Service** → **Postgres**
- Keep the default settings (EasyPanel creates the database automatically)
- Copy the **internal connection URL** — you'll need it in step 4

### 3. Add the App

- Click **+ New Service** → **App**
- Go to the **Build** tab and select **GitHub**
- Fill in the fields:
  | Field | Value |
  |---|---|
  | Owner | `mosqueiro` |
  | Repository | `youtube-manager` |
  | Branch | `main` |
  | Path | `/` |
- EasyPanel will detect the `Dockerfile` and build the image automatically

### 4. Configure Environment Variables

- Go to the **Environment** tab and add:
  | Variable | Value |
  |---|---|
  | `DATABASE_URL` | The PostgreSQL connection URL from step 2 |
  | `YOUTUBE_API_KEY` | Your YouTube API key |

### 5. Configure Domain

- Go to the **Domains** tab
- Add your domain or use the auto-generated EasyPanel URL
- Port: **3000**

### 6. Deploy

- Click **Deploy** — EasyPanel will clone the repo, build the image, and connect it to PostgreSQL
- Open the URL and you're ready! 🎉

> 💡 EasyPanel handles SSL, restarts, and auto-deploy on new commits.

---

## 🛑 Stopping & Starting

```bash
cd ~/youtube-manager   # or wherever you installed it

docker compose down    # stop everything
docker compose up -d   # start again
```

Your data is preserved — no need to re-sync! 🎉

---

## 🛠️ Built With

| | Technology |
|---|-----------|
| ⚡ | Next.js 16 |
| 🔷 | TypeScript |
| 🎨 | Tailwind CSS 4 |
| 🐘 | PostgreSQL 16 |
| 📺 | YouTube Data API v3 |
| 📦 | Zustand |
| 📆 | date-fns |
| 🎯 | Lucide React icons |

---

## ❓ FAQ

**Q: Is the YouTube API Key free?**
Yes! Google gives you 10,000 free units per day. Each sync uses about 3-5 units per channel, so you'd need to sync hundreds of channels daily to hit the limit.

**Q: Does the app post or modify anything on YouTube?**
No. It's completely **read-only**. It only fetches public data (video titles, thumbnails, stats). It cannot post, delete, or modify anything on your YouTube account.

**Q: Where is my data stored?**
Everything is stored in a **local PostgreSQL database** running in Docker on your machine. Nothing is sent to external servers (except the YouTube API calls during sync).

**Q: How many videos does it fetch per channel?**
The last **50 videos** per channel on each sync.

**Q: Can I add any YouTube channel?**
Yes, any public YouTube channel — yours or anyone else's.

---

## 📄 License

MIT

---

<p align="center">
  Built with ❤️ and ☕<br/>
  Powered by <strong>YouTube Data API v3</strong> + <strong>Next.js</strong> + <strong>PostgreSQL</strong>
</p>
