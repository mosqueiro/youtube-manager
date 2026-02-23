const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "..", "data", "youtube-manager.db");

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      handle TEXT,
      avatar_url TEXT,
      subscriber_count INTEGER,
      color TEXT NOT NULL,
      videos_per_day INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      thumbnail_url TEXT,
      published_at TEXT NOT NULL,
      duration TEXT,
      view_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      comment_count INTEGER DEFAULT 0,
      scheduled_at TEXT,
      description TEXT,
      status TEXT DEFAULT 'public',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sync_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
      synced_at TEXT DEFAULT (datetime('now')),
      videos_fetched INTEGER DEFAULT 0,
      status TEXT DEFAULT 'success',
      error_message TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON videos(channel_id);
    CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at);
    CREATE INDEX IF NOT EXISTS idx_sync_log_channel_id ON sync_log(channel_id);
  `);

  console.log("✓ Database tables created successfully at", DB_PATH);
} catch (err) {
  console.error("✗ Error creating tables:", err.message);
  process.exit(1);
} finally {
  db.close();
}
